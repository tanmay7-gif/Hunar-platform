export interface PayPalCreateOrderRequest {
  orderId?: string;
  amount: number | string;
  currency?: string;
  description?: string;
}

export interface PayPalCreateOrderResponse {
  success: boolean;
  orderID?: string;
  status?: string;
  approvalUrl?: string;
  isMock?: boolean;
  message?: string;
  error?: string;
}

export interface PayPalCaptureRequest {
  orderID: string;
}

export interface PayPalCaptureResponse {
  success: boolean;
  orderID?: string;
  transactionRef?: string;
  status?: string;
  payer?: {
    name?: { given_name?: string; surname?: string };
    email_address?: string;
  };
  payment?: Record<string, unknown>;
  isMock?: boolean;
  message?: string;
  error?: string;
}

export interface PayPalOrderDetails {
  id: string;
  status: string;
  intent: string;
  purchase_units: Array<{
    amount: {
      currency_code: string;
      value: string;
    };
  }>;
}
