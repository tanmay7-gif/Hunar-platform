import { Router } from "express";
import { Channel3Controller } from "../controllers/channel3.controller";

const router = Router();

// Channel3 Valuation & Fair-Price Copilot
router.post("/valuation", Channel3Controller.getValuation);
router.get("/valuation", Channel3Controller.getValuation);

// Channel3 Commercial Product Benchmark Search
router.post("/search", Channel3Controller.searchProducts);
router.get("/search", Channel3Controller.searchProducts);

// Channel3 Market Trend Metrics for Intelligence Bar
router.get("/trends", Channel3Controller.getMarketTrends);

export default router;

