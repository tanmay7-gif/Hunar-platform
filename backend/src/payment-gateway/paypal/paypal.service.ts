import { config } from "../../config/config";
import {
  PayPalCreateOrderRequest,
  PayPalCreateOrderResponse,
  PayPalCaptureResponse,
} from "../../models/types";

let cachedToken: { token: string; expiresAt: number } | null = null;

export class PayPalService {
  /**
   * Check if PayPal credentials are dummy/placeholder or missing
   */
  public static isDummyCredentials(): boolean {
    const clientId = config.PAYPAL_CLIENT_ID || config.paypal.clientId;
    const clientSecret = config.PAYPAL_CLIENT_SECRET || config.paypal.clientSecret;

    if (!clientId || !clientSecret) return true;

    const dummyValues = [
      "your_sandbox_client_id",
      "your_sandbox_secret",
      "your_client_id",
      "your_secret",
      "dummy",
      "placeholder",
    ];

    if (dummyValues.includes(clientId) || dummyValues.includes(clientSecret)) return true;
    if (clientId.startsWith("your_") || clientSecret.startsWith("your_")) return true;

    return false;
  }

  /**
   * Generate or retrieve cached PayPal OAuth 2.0 access token
   */
  public static async getAccessToken(): Promise<string> {
    if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) {
      return cachedToken.token;
    }

    const clientId = config.PAYPAL_CLIENT_ID || config.paypal.clientId;
    const clientSecret = config.PAYPAL_CLIENT_SECRET || config.paypal.clientSecret;
    const apiBase = config.PAYPAL_API_BASE || config.paypal.apiBase || "https://api-m.sandbox.paypal.com";

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const response = await fetch(`${apiBase}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PayPal Auth failed (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as { access_token: string; expires_in: number };
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
    };

    return cachedToken.token;
  }

  /**
   * Create PayPal Order via REST API v2 (/v2/checkout/orders)
   */
  public static async createOrder(params: PayPalCreateOrderRequest): Promise<PayPalCreateOrderResponse> {
    const { orderId, description } = params;
    let currency = params.currency || "USD";
    let amount = Number(params.amount);
    let inrEquivalent: number | undefined;

    if (currency === "INR" || (!params.currency && amount > 100)) {
      inrEquivalent = amount;
      amount = Math.round((amount / 85) * 100) / 100;
      currency = "USD";
    } else {
      amount = Math.round(amount * 100) / 100;
      currency = currency.toUpperCase();
    }

    if (PayPalService.isDummyCredentials()) {
      const mockOrderId = `MOCK-PAYPAL-${Date.now()}`;
      return {
        success: true,
        id: mockOrderId,
        orderID: mockOrderId,
        status: "CREATED",
        currency,
        amount,
        inrEquivalent,
        links: [
          {
            href: `https://www.sandbox.paypal.com/checkoutnow?token=${mockOrderId}`,
            rel: "approve",
            method: "GET",
          },
          {
            href: `${config.PAYPAL_API_BASE}/v2/checkout/orders/${mockOrderId}/capture`,
            rel: "capture",
            method: "POST",
          },
        ],
        isMock: true,
      };
    }

    const accessToken = await PayPalService.getAccessToken();
    const apiBase = config.PAYPAL_API_BASE || config.paypal.apiBase || "https://api-m.sandbox.paypal.com";

    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: orderId || `HNR-${Date.now()}`,
          description: description || `Hunar Artisan Commission - Order #${orderId || Date.now()}`,
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
        },
      ],
      application_context: {
        brand_name: "Hunar Grassroots Art Guild",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: "http://localhost:3000/dashboard/chat?payment=paypal_success",
        cancel_url: "http://localhost:3000/dashboard/chat?payment=paypal_cancel",
      },
    };

    const response = await fetch(`${apiBase}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PayPal Create Order failed (${response.status}): ${errorText}`);
    }

    const orderData = (await response.json()) as any;

    return {
      success: true,
      id: orderData.id,
      orderID: orderData.id,
      status: orderData.status,
      currency,
      amount,
      inrEquivalent,
      links: orderData.links || [],
    };
  }

  /**
   * Capture PayPal Order via REST API v2 (/v2/checkout/orders/{id}/capture)
   */
  public static async captureOrder(orderID: string): Promise<PayPalCaptureResponse> {
    if (orderID.startsWith("MOCK-PAYPAL-") || PayPalService.isDummyCredentials()) {
      const mockTxnRef = `MOCK-TXN-${Date.now()}`;
      const paymentRecord = {
        id: `pay-${Date.now()}`,
        orderId: orderID,
        transactionRef: mockTxnRef,
        amount: 25.0,
        currency: "USD",
        method: "PAYPAL",
        status: "PAID",
        createdAt: new Date().toISOString(),
      };

      return {
        success: true,
        orderID,
        transactionRef: mockTxnRef,
        status: "COMPLETED",
        orderStatus: "Crafting in Progress",
        payment: paymentRecord,
        isMock: true,
        message: "Payment captured successfully via Mock Sandbox simulator.",
      };
    }

    const accessToken = await PayPalService.getAccessToken();
    const apiBase = config.PAYPAL_API_BASE || config.paypal.apiBase || "https://api-m.sandbox.paypal.com";

    const response = await fetch(`${apiBase}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PayPal Capture Order failed (${response.status}): ${errorText}`);
    }

    const captureData = (await response.json()) as any;
    const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0];
    const txnRef = capture?.id || `PP-CAP-${Date.now()}`;

    const paymentRecord = {
      id: `pay-${Date.now()}`,
      orderId: captureData.id,
      transactionRef: txnRef,
      amount: Number(capture?.amount?.value || 0),
      currency: capture?.amount?.currency_code || "USD",
      method: "PAYPAL",
      status: "PAID",
      payerName: `${captureData.payer?.name?.given_name || ""} ${captureData.payer?.name?.surname || ""}`.trim(),
      payerEmail: captureData.payer?.email_address,
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      orderID: captureData.id,
      transactionRef: txnRef,
      status: captureData.status || "COMPLETED",
      orderStatus: "Crafting in Progress",
      captureId: capture?.id,
      payment: paymentRecord,
    };
  }
}
