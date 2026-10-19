import { Request, Response } from "express";
import { db } from "../config/db";
import { protectCreator } from "../services/imageProtection";

export const CreatorsController = {
  getAll: (req: Request, res: Response) => {
    try {
      const { artForm, city, search, verifiedOnly } = req.query;
      let creators = db.getCreators();

      if (artForm && artForm !== "All") {
        creators = creators.filter(
          (c) => c.primaryArtForm.toLowerCase() === String(artForm).toLowerCase()
        );
      }

      if (city && city !== "All") {
        creators = creators.filter((c) =>
          c.city.toLowerCase().includes(String(city).toLowerCase())
        );
      }

      if (verifiedOnly === "true") {
        creators = creators.filter((c) => c.isVerified);
      }

      if (search) {
        const q = String(search).toLowerCase();
        creators = creators.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.city.toLowerCase().includes(q) ||
            c.primaryArtForm.toLowerCase().includes(q) ||
            c.bio.toLowerCase().includes(q)
        );
      }

      // Backend-enforced watermarking and resolution capping on all creator portfolio images
      const protectedCreators = creators.map((c) => protectCreator(c));
      return res.status(200).json(protectedCreators);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch creators";
      return res.status(500).json({ error: message });
    }
  },

  getByUsername: (req: Request, res: Response) => {
    const { username } = req.params;
    const creator = db.getCreatorByUsername(username);
    if (!creator) {
      return res.status(404).json({ error: "Artisan profile not found" });
    }
    return res.status(200).json(protectCreator(creator));
  },
};
