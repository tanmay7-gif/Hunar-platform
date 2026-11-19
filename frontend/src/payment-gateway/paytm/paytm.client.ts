import {
  PaytmInitiateRequest,
  PaytmInitiateResponse,
  PaytmVerifyRequest,
  PaytmVerifyResponse,
  PaytmSimulateRequest,
} from "./types";

/**
 * Initiates a Paytm Staging transaction via Next.js Route Handler
 */
export async function initiatePaytmTransaction(
  params: PaytmInitiateRequest
): Promise<PaytmInitiateResponse> {
  const response = await fetch("/api/payment/paytm/initiate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();
  if (!response.ok && !data.success) {
    throw new Error(data.error || "Failed to initiate Paytm transaction");
  }
  return data;
}

/**
 * Verifies a Paytm transaction token via Next.js Route Handler
 */
export async function verifyPaytmTransaction(
  params: PaytmVerifyRequest
): Promise<PaytmVerifyResponse> {
  const response = await fetch("/api/payment/paytm/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();
  if (!response.ok && !data.success) {
    throw new Error(data.error || "Failed to verify Paytm transaction");
  }
  return data;
}

/**
 * Simulates an instant successful Paytm Staging payment for offline demos/evaluations
 */
export async function simulatePaytmPayment(
  params: PaytmSimulateRequest
): Promise<PaytmVerifyResponse> {
  const response = await fetch("/api/payment/paytm/simulate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();
  if (!response.ok && !data.success) {
    throw new Error(data.error || "Failed to simulate Paytm payment");
  }
  return data;
}

/**
 * Constructs a standard NPCI compliant UPI payment URI string
 */
export function generateUpiUri(params: {
  upiId: string;
  payeeName: string;
  amount: number;
  orderId: string;
  note?: string;
}): string {
  const pa = encodeURIComponent(params.upiId);
  const pn = encodeURIComponent(params.payeeName);
  const am = params.amount.toFixed(2);
  const tr = encodeURIComponent(params.orderId);
  const tn = encodeURIComponent(params.note || `Hunar Artisan Order ${params.orderId}`);
  return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=INR&tr=${tr}&tn=${tn}`;
}
