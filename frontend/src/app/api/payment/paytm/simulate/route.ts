import { NextRequest, NextResponse } from "next/server";
import { PaytmVerifyResponse } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const orderId = body.orderId || `HNR-ORD-${Date.now()}`;
    const amount = Number(body.amount || 1500);
    const conversationId = body.conversationId;

    const mockTxnId = `PTM-SIM-${Date.now()}`;
    const bankTxnId = `BNK-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const paymentRecord = {
      id: `pay-${Date.now()}`,
      orderId,
      conversationId,
      method: "PAYTM",
      status: "PAID",
      transactionRef: mockTxnId,
      bankTxnId,
      amount,
      currency: "INR",
      createdAt: new Date().toISOString(),
      isMock: true,
      simulationSource: "Paytm Staging Offline Simulator",
    };

    const response: PaytmVerifyResponse = {
      success: true,
      status: "TXN_SUCCESS",
      orderId,
      txnId: mockTxnId,
      bankTxnId,
      txnAmount: amount,
      currency: "INR",
      gatewayName: "PAYTM_STAGING_SIMULATOR",
      paymentMode: "PAYTM_WALLET",
      txnDate: new Date().toISOString(),
      isMock: true,
      message: "Paytm simulation confirmed instantly without live bank OTP.",
      orderStatus: "Crafting in Progress",
      payment: paymentRecord,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err: any) {
    console.error("[Paytm Simulator API] Error in simulate:", err);
    return NextResponse.json(
      {
        success: false,
        status: "TXN_FAILURE",
        message: err.message || "Paytm simulation failed",
      },
      { status: 500 }
    );
  }
}

