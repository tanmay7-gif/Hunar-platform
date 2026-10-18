import express, { Request, Response } from "express";
import cors from "cors";
import { config } from "./config/config";
import apiRouter from "./routes";
import { requestLogger } from "./middleware/logger.middleware";
import { errorHandler } from "./middleware/errorHandler.middleware";
import { authMiddleware } from "./middleware/auth.middleware";

const app = express();

// Middlewares
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json());
app.use(requestLogger);
app.use(authMiddleware);

// API Routes
app.use("/api", apiRouter);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    name: "Hunar Platform API",
    version: "1.0.0",
    docs: "/api/health",
  });
});

// Error handling
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, () => {
    console.log(`[Hunar Backend] Server active at http://localhost:${config.port}`);
    console.log(`[Hunar Backend] API Root available at http://localhost:${config.port}/api`);
  });
}

export default app;
