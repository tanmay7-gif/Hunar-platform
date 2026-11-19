export type PaymentMethod =
  | "upi"
  | "card"
  | "paypal"
  | "paytm"
  | "UPI_QR"
  | "NETBANKING"
  | "PAYPAL"
  | "PAYTM";

export type PaymentTab = "paytm" | "paypal";
export type PaytmSubMethod = "UPI" | "CARD" | "WALLET";

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  amount: number;
  productTitle?: string;
  productImage?: string;
  sellerName: string;
  sellerCity?: string;
  conversationId?: string;
  onConfirmPayment: (method: PaymentMethod, details?: any) => Promise<any>;
}

export interface PaymentTransactionRecord {
  orderId: string;
  transactionRef: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: "PAID" | "PENDING" | "FAILED";
  paymentMode?: string;
  createdAt: string;
  rawDetails?: Record<string, unknown>;
}
