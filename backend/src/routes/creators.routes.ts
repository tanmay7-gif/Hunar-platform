import { Router } from "express";
import { CreatorsController } from "../controllers/creators.controller";

const router = Router();

router.get("/", CreatorsController.getAll);
router.get("/:username", CreatorsController.getByUsername);

export default router;
