import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";

const router = Router();

// UPI & Local Process Endpoints
router.post("/upi-intent", PaymentController.generateUpiIntent);
router.post("/process", PaymentController.processPayment);
router.get("/history", PaymentController.getPaymentHistory);

// PayPal Developer Platform (Sandbox API v2) Endpoints
router.post("/paypal/create-order", PaymentController.createPayPalOrder);
router.post("/paypal/capture-order", PaymentController.capturePayPalOrder);

export default router;
