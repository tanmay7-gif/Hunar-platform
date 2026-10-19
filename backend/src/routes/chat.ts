import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";

const router = Router();

router.get("/conversations", ChatController.getConversations);
router.get("/conversations/:id", ChatController.getConversationById);
router.post("/conversations/:id/messages", ChatController.sendMessage);
router.post("/conversations/:id/invoice", ChatController.createPaymentInvoice);

export default router;
