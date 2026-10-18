import { Request, Response } from "express";
import { db } from "../config/db";

export const OpportunitiesController = {
  getAll: (req: Request, res: Response) => {
    try {
      const { category, type, location } = req.query;
      let opportunities = db.getOpportunities();

      if (category && category !== "All") {
        opportunities = opportunities.filter((o) =>
          o.category.toLowerCase().includes(String(category).toLowerCase())
        );
      }

      if (type && type !== "All") {
        opportunities = opportunities.filter(
          (o) => o.type.toLowerCase() === String(type).toLowerCase()
        );
      }

      if (location && location !== "All") {
        opportunities = opportunities.filter((o) =>
          o.location.toLowerCase().includes(String(location).toLowerCase())
        );
      }

      return res.status(200).json(opportunities);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch opportunities";
      return res.status(500).json({ error: message });
    }
  },

  create: (req: Request, res: Response) => {
    try {
      const {
        title,
        titleHindi,
        description,
        category,
        type,
        typeHindi,
        location,
        budgetMin,
        budgetMax,
        deadline,
        postedBy,
        postedByOrg,
        postedByAvatar,
        postedByVerified,
        requirements,
        tags,
        featured,
        matchedCategories,
      } = req.body;

      if (!title || !description || !budgetMax) {
        return res.status(400).json({
          error: "title, description, and budgetMax are required",
        });
      }

      const newOpportunity = db.createOpportunity({
        title,
        titleHindi: titleHindi || title,
        description,
        category: category || "Folk & Studio Commission",
        type: type || "Commission",
        typeHindi: typeHindi || type || "कमीशन",
        location: location || "Delhi NCR",
        budgetMin: Number(budgetMin) || 10000,
        budgetMax: Number(budgetMax) || 25000,
        deadline: deadline || "Within 30 days",
        postedBy: postedBy || "Verified Patron",
        postedByOrg: postedByOrg || "Private Commission",
        postedByAvatar: postedByAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        postedByVerified: postedByVerified ?? true,
        requirements: requirements || ["Authentic handmade craftsmanship"],
        tags: tags || ["Custom", "Heritage"],
        featured: featured ?? false,
        matchedCategories: matchedCategories || [category || "Craft"],
      });

      return res.status(201).json(newOpportunity);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create opportunity";
      return res.status(500).json({ error: message });
    }
  },
};
