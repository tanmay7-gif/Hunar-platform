// ========================================================
// HUNAR PAYMENT GATEWAY MODULE (PAYTM STAGING + PAYPAL SANDBOX)
// ========================================================

import { PaymentModal } from "./components/PaymentModal";

export * from "./types";
export * from "./paypal";
export * from "./paytm";
export { PaymentModal } from "./components/PaymentModal";
export { QRCodeDisplay } from "./components/QRCodeDisplay";
export default PaymentModal;
