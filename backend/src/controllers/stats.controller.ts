import { Request, Response } from "express";
import { db } from "../config/db";

export const StatsController = {
  getOverview: (req: Request, res: Response) => {
    try {
      const products = db.getProducts();
      const creators = db.getCreators();
      const opportunities = db.getOpportunities();
      const inquiries = db.getInquiries();

      const totalGMV = inquiries
        .filter((i) => i.status === "Completed")
        .reduce((sum, i) => sum + i.proposedBudget, 0);

      const activeGigsCount = opportunities.length;

      return res.status(200).json({
        totalArtisans: creators.length,
        totalProducts: products.length,
        activeGigs: activeGigsCount,
        totalInquiries: inquiries.length,
        patronEquityPaidOut: totalGMV,
        zeroCommissionGuarantee: "100% direct artisan payout",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch stats";
      return res.status(500).json({ error: message });
    }
  },
};
