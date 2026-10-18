import { Router, Request, Response } from "express";
import authRoutes from "./auth.routes";
import productsRoutes from "./products.routes";
import creatorsRoutes from "./creators.routes";
import inquiriesRoutes from "./inquiries.routes";
import opportunitiesRoutes from "./opportunities.routes";
import statsRoutes from "./stats.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/products", productsRoutes);
apiRouter.use("/creators", creatorsRoutes);
apiRouter.use("/inquiries", inquiriesRoutes);
apiRouter.use("/opportunities", opportunitiesRoutes);
apiRouter.use("/stats", statsRoutes);

// Health check
apiRouter.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "Hunar Backend API",
    timestamp: new Date().toISOString(),
  });
});

export default apiRouter;
