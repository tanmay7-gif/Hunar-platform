import { Router } from "express";
import { InquiriesController } from "../controllers/inquiries.controller";

const router = Router();

router.get("/", InquiriesController.getAll);
router.post("/", InquiriesController.create);
router.patch("/:id", InquiriesController.updateStatus);

export default router;
