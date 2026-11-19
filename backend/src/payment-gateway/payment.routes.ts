import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router();

// UPI & Direct Platform Process Endpoints
router.post("/upi-intent", PaymentController.generateUpiIntent);
router.post("/process", PaymentController.processPayment);
router.get("/history", PaymentController.getPaymentHistory);

// PayPal Developer Platform (Sandbox REST API v2) Endpoints
router.post("/paypal/create-order", PaymentController.createPayPalOrder);
router.post("/paypal/capture-order", PaymentController.capturePayPalOrder);

// Paytm Payment Gateway (Staging / Sandbox) Endpoints
router.post("/paytm/initiate", PaymentController.initiatePaytmTransaction);
router.post("/paytm/verify", PaymentController.verifyPaytmTransaction);

export default router;
