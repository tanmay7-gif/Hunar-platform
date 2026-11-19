"use client";

// Re-export from dedicated payment-gateway module for backwards compatibility
export { QRCodeDisplay as default, QRCodeDisplay } from "@/payment-gateway";
export type { QRCodeDisplayProps } from "@/payment-gateway/components/QRCodeDisplay";
