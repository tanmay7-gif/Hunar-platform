import {
  PayPalCreateOrderRequest,
  PayPalCreateOrderResponse,
  PayPalCaptureRequest,
  PayPalCaptureResponse,
} from "./types";

export const DEFAULT_INR_TO_USD_RATE = 86.5;

/**
 * Converts INR amounts to USD with 2 decimal precision.
 */
export function inrToUsd(inrAmount: number, rate: number = DEFAULT_INR_TO_USD_RATE): string {
  const safeInr = Math.max(0, Number(inrAmount) || 0);
  const usd = safeInr / rate;
  return usd.toFixed(2);
}

/**
 * Returns the configured PayPal client ID or fallback sandbox ID
 */
export function getPayPalClientId(): string {
  return (
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
    "Abt7G793_0h6n4YpD3y0E5A7K_9H8Q7R6S5T4U3V2W1X0Y_Z9A8B7C6D5E4F3G2H1"
  );
}

/**
 * Server-side order creation for PayPal Sandbox checkout
 */
export async function createPayPalOrder(
  params: PayPalCreateOrderRequest
): Promise<PayPalCreateOrderResponse> {
  const usdAmount =
    params.currency === "USD"
      ? Number(params.amount).toFixed(2)
      : inrToUsd(Number(params.amount));

  const response = await fetch("/api/payment/paypal/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderId: params.orderId,
      amount: usdAmount,
      currency: "USD",
      description: params.description || `Hunar Artisan Commission - Order #${params.orderId}`,
    }),
  });

  const data = await response.json();
  if (!response.ok && !data.success) {
    throw new Error(data.error || "Failed to initialize PayPal order");
  }
  return data;
}

/**
 * Server-side order capture for PayPal Sandbox checkout
 */
export async function capturePayPalOrder(
  params: PayPalCaptureRequest
): Promise<PayPalCaptureResponse> {
  const response = await fetch("/api/payment/paypal/capture-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderID: params.orderID,
    }),
  });

  const data = await response.json();
  if (!response.ok && !data.success) {
    throw new Error(data.error || "Failed to capture PayPal transaction");
  }
  return data;
}
