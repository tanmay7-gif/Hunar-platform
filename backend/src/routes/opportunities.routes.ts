import { Router } from "express";
import { OpportunitiesController } from "../controllers/opportunities.controller";

const router = Router();

router.get("/", OpportunitiesController.getAll);
router.post("/", OpportunitiesController.create);

export default router;
