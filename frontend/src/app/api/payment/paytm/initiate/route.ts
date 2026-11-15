import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { PaytmInitiateRequest, PaytmInitiateResponse } from "@/types";

function isDummyCredentials(mid?: string, key?: string): boolean {
  if (!mid || !key) return true;
  const dummyValues = [
    "your_staging_mid",
    "your_staging_key",
    "your_mid",
    "your_merchant_key",
    "dummy",
    "placeholder",
  ];
  if (dummyValues.includes(mid.trim()) || dummyValues.includes(key.trim())) return true;
  if (mid.startsWith("your_") || key.startsWith("your_")) return true;
  return false;
}

function generateSignature(body: Record<string, unknown>, merchantKey: string): string {
  const bodyString = JSON.stringify(body);
  return crypto.createHmac("sha256", merchantKey).update(bodyString).digest("base64");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PaytmInitiateRequest;
    const {
      orderId = `HNR-${Date.now()}`,
      amount = 1500,
      customerId = `CUST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      customerPhone,
      customerEmail,
    } = body;

    const mid =
      process.env.PAYTM_MID ||
      process.env.NEXT_PUBLIC_PAYTM_MID ||
      "DIY1238682135545801";
    const merchantKey = process.env.PAYTM_MERCHANT_KEY || "bKMfNxPPf_Q!ZhKr";
    const website = process.env.PAYTM_WEBSITE || "WEBSTAGING";
    const host =
      process.env.PAYTM_HOST || "https://securegw-stage.paytm.in";

    const formattedAmount = Number(amount).toFixed(2);

    // If credentials are dummy/placeholder, return clean staging mock token
    if (isDummyCredentials(mid, merchantKey)) {
      console.warn("[Paytm Staging] Missing or dummy merchant credentials; activating Sandbox Simulator mode.");
      const mockToken = `MOCK-PAYTM-TOKEN-${Date.now()}`;
      const mockResponse: PaytmInitiateResponse = {
        success: true,
        txnToken: mockToken,
        orderId,
        amount: Number(formattedAmount),
        mid,
        callbackUrl: "/api/payment/paytm/verify",
        status: "INITIATED",
        isMock: true,
        message: "Paytm Staging mock token generated for testing.",
      };
      return NextResponse.json(mockResponse, { status: 200 });
    }

    // Build standard Paytm API v1 initiateTransaction payload
    const paytmBody: Record<string, unknown> = {
      requestType: "Payment",
      mid,
      websiteName: website,
      orderId,
      callbackUrl: "/api/payment/paytm/verify",
      txnAmount: {
        value: formattedAmount,
        currency: "INR",
      },
      userInfo: {
        custId: customerId,
        ...(customerPhone ? { mobile: customerPhone } : {}),
        ...(customerEmail ? { email: customerEmail } : {}),
      },
    };

    const signature = generateSignature(paytmBody, merchantKey);

    const payload = {
      body: paytmBody,
      head: {
        signature,
      },
    };

    try {
      const endpoint = `${host}/theia/api/v1/initiateTransaction?mid=${encodeURIComponent(
        mid
      )}&orderId=${encodeURIComponent(orderId)}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = (await response.json()) as any;

      if (
        response.ok &&
        responseData?.body?.resultInfo?.resultStatus === "S" &&
        responseData?.body?.txnToken
      ) {
        const liveResponse: PaytmInitiateResponse = {
          success: true,
          txnToken: responseData.body.txnToken,
          orderId,
          amount: Number(formattedAmount),
          mid,
          callbackUrl: "/api/payment/paytm/verify",
          status: "INITIATED",
          isMock: false,
          rawResult: responseData,
        };
        return NextResponse.json(liveResponse, { status: 200 });
      }

      console.warn(
        "[Paytm Staging] Live API returned non-success result, falling back to simulator token:",
        responseData?.body?.resultInfo || responseData
      );

      // Fallback for staging network restrictions or mock test IDs
      const fallbackToken = `MOCK-PAYTM-TOKEN-${Date.now()}`;
      return NextResponse.json(
        {
          success: true,
          txnToken: fallbackToken,
          orderId,
          amount: Number(formattedAmount),
          mid,
          callbackUrl: "/api/payment/paytm/verify",
          status: "INITIATED",
          isMock: true,
          message:
            responseData?.body?.resultInfo?.resultMsg ||
            "Staging sandbox fallback token issued.",
          rawResult: responseData,
        },
        { status: 200 }
      );
    } catch (networkErr: any) {
      console.warn(
        "[Paytm Staging] Network connection error to Paytm Gateway, activating simulator:",
        networkErr.message
      );
      const fallbackToken = `MOCK-PAYTM-TOKEN-${Date.now()}`;
      return NextResponse.json(
        {
          success: true,
          txnToken: fallbackToken,
          orderId,
          amount: Number(formattedAmount),
          mid,
          callbackUrl: "/api/payment/paytm/verify",
          status: "INITIATED",
          isMock: true,
          message: "Paytm staging server connection timeout; simulator active.",
        },
        { status: 200 }
      );
    }
  } catch (err: any) {
    console.error("[Paytm Staging] initiateTransaction internal error:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to initiate Paytm transaction.",
        txnToken: `MOCK-PAYTM-TOKEN-${Date.now()}`,
        orderId: `HNR-${Date.now()}`,
        amount: 1500,
        isMock: true,
      },
      { status: 500 }
    );
  }
}

