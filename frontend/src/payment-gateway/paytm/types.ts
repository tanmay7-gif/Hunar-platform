export type PaytmPaymentMode = "PAYTM_WALLET" | "UPI" | "NETBANKING" | "CC_DC" | "SIMULATED";

export interface PaytmInitiateRequest {
  orderId?: string;
  amount: number | string;
  customerId?: string;
  customerPhone?: string;
  customerEmail?: string;
}

export interface PaytmInitiateResponse {
  success: boolean;
  txnToken?: string;
  orderId: string;
  amount: number;
  mid?: string;
  callbackUrl?: string;
  status: string;
  isMock?: boolean;
  message?: string;
  error?: string;
}

export interface PaytmVerifyRequest {
  orderId: string;
  txnToken?: string;
}

export interface PaytmVerifyResponse {
  success: boolean;
  orderId: string;
  transactionRef: string;
  amount: number;
  currency: string;
  status: "TXN_SUCCESS" | "TXN_FAILURE" | "PENDING";
  paymentMode?: string;
  payment?: Record<string, unknown>;
  isMock?: boolean;
  message?: string;
  error?: string;
}

export interface PaytmSimulateRequest {
  orderId: string;
  amount: number;
  paymentMode?: PaytmPaymentMode;
}
