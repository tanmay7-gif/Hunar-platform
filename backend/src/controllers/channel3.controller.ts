import { Request, Response } from "express";
import { Channel3Service } from "../services/channel3.service";
import { Channel3ValuationRequest } from "../models/types";

export class Channel3Controller {
  /**
   * Calculate fair-pricing valuation and compare against commercial benchmarks
   * (POST /api/channel3/valuation or GET /api/channel3/valuation)
   */
  public static async getValuation(req: Request, res: Response) {
    try {
      const data = req.method === "GET" ? req.query : req.body;
      const query = (data.query as string) || "Terracotta Handcrafted Vase";
      const category = (data.category as string) || undefined;
      const costOfMaterials = data.costOfMaterials ? Number(data.costOfMaterials) : undefined;
      const hoursToCraft = data.hoursToCraft ? Number(data.hoursToCraft) : undefined;
      const currency = (data.currency as string) || "INR";

      const valuationParams: Channel3ValuationRequest = {
        query,
        category,
        costOfMaterials,
        hoursToCraft,
        currency,
      };

      const valuation = await Channel3Service.calculateArtisanFairPrice(valuationParams);

      return res.status(200).json({
        success: true,
        valuation,
      });
    } catch (err: any) {
      console.error("[Channel3 Controller] getValuation error:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to calculate fair valuation",
      });
    }
  }

  /**
   * Search Channel3 commercial product benchmarks
   * (GET /api/channel3/search or POST /api/channel3/search)
   */
  public static async searchProducts(req: Request, res: Response) {
    try {
      const data = req.method === "GET" ? req.query : req.body;
      const query = (data.query as string) || "Pottery";
      const category = (data.category as string) || undefined;
      const limit = data.limit ? parseInt(data.limit as string, 10) : 5;

      const { products, isMock } = await Channel3Service.searchMarketProducts(query, category, limit);

      return res.status(200).json({
        success: true,
        count: products.length,
        products,
        isMock,
      });
    } catch (err: any) {
      console.error("[Channel3 Controller] searchProducts error:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to search Channel3 products",
      });
    }
  }

  /**
   * Retrieve platform-wide market trend metrics across craft categories
   * (GET /api/channel3/trends)
   */
  public static async getMarketTrends(req: Request, res: Response) {
    try {
      const trends = Channel3Service.getMarketTrends();
      return res.status(200).json({
        success: true,
        count: trends.length,
        trends,
      });
    } catch (err: any) {
      console.error("[Channel3 Controller] getMarketTrends error:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to fetch market trends",
      });
    }
  }
}

