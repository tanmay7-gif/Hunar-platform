import { Request, Response } from "express";
import { db } from "../config/db";
import { CustomerInquiry } from "../models/types";

export const InquiriesController = {
  getAll: (req: Request, res: Response) => {
    try {
      const { customerId, sellerId } = req.query;
      let inquiries = db.getInquiries();

      if (customerId) {
        inquiries = inquiries.filter((i) => i.customerId === customerId);
      }

      if (sellerId) {
        inquiries = inquiries.filter((i) => i.sellerId === sellerId);
      }

      return res.status(200).json(inquiries);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch inquiries";
      return res.status(500).json({ error: message });
    }
  },

  create: (req: Request, res: Response) => {
    try {
      const {
        customerId,
        customerName,
        customerPhone,
        customerEmail,
        sellerId,
        sellerName,
        sellerAvatar,
        productId,
        productTitle,
        productImage,
        type,
        requirements,
        proposedBudget,
        timeline,
      } = req.body;

      if (!customerId || !sellerId || !requirements) {
        return res.status(400).json({
          error: "customerId, sellerId, and requirements are required",
        });
      }

      const newInquiry = db.createInquiry({
        customerId,
        customerName: customerName || "Anonymous Patron",
        customerPhone: customerPhone || "+91 98765 43210",
        customerEmail: customerEmail || "patron@hunar.in",
        sellerId,
        sellerName: sellerName || "Artisan Studio",
        sellerAvatar: sellerAvatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
        productId,
        productTitle,
        productImage,
        type: type || "custom_commission",
        requirements,
        proposedBudget: Number(proposedBudget) || 5000,
        timeline: timeline || "Within 14 days",
        status: "Under Review",
      });

      return res.status(201).json(newInquiry);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create inquiry";
      return res.status(500).json({ error: message });
    }
  },

  updateStatus: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, note } = req.body;

      if (!status) {
        return res.status(400).json({ error: "status is required" });
      }

      const validStatuses: CustomerInquiry["status"][] = [
        "Under Review",
        "Crafting in Progress",
        "Dispatched",
        "Completed",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status: ${status}` });
      }

      const updated = db.updateInquiryStatus(id, status, note);
      if (!updated) {
        return res.status(404).json({ error: "Inquiry not found" });
      }

      return res.status(200).json(updated);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update inquiry status";
      return res.status(500).json({ error: message });
    }
  },
};
