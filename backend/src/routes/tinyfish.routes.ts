import { Router } from "express";
import { TinyFishController } from "../controllers/tinyfish.controller";

const router = Router();

router.get("/health", TinyFishController.getHealth);
router.post("/search", TinyFishController.search);
router.post("/fetch", TinyFishController.fetch);
router.post("/agent", TinyFishController.runAgent);
router.post("/browser", TinyFishController.executeBrowser);

export default router;
