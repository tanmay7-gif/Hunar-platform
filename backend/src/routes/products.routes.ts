import { Router } from "express";
import { ProductsController } from "../controllers/products.controller";

const router = Router();

router.get("/", ProductsController.getAll);
router.get("/:id", ProductsController.getById);
router.post("/", ProductsController.create);

export default router;
