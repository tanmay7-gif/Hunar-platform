import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";

const router = Router();

router.post("/upi-intent", PaymentController.generateUpiIntent);
router.post("/process", PaymentController.processPayment);
router.get("/history", PaymentController.getPaymentHistory);

export default router;
