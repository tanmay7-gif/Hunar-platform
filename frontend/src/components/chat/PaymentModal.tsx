"use client";

// Re-export from dedicated payment-gateway module for backwards compatibility
export { PaymentModal as default, PaymentModal } from "@/payment-gateway";
export type { PaymentTab, PaytmSubMethod, PaymentModalProps } from "@/payment-gateway";
