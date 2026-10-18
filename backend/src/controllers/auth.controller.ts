import { Request, Response } from "express";
import { db } from "../config/db";

export const AuthController = {
  login: (req: Request, res: Response) => {
    try {
      const { email, password, role } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const account = db.authenticate(email);
      if (account) {
        return res.status(200).json({
          success: true,
          user: account,
          token: `demo-jwt-token-${account.id}`,
        });
      }

      // Default fallback for custom user
      const fallbackUser = {
        id: `user-${Date.now()}`,
        name: email.split("@")[0],
        email,
        role: role || "CUSTOMER",
        city: "Delhi NCR",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        isVerified: true,
      };

      return res.status(200).json({
        success: true,
        user: fallbackUser,
        token: `demo-jwt-token-${fallbackUser.id}`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication error";
      return res.status(500).json({ error: message });
    }
  },

  getCurrentUser: (req: Request, res: Response) => {
    const accounts = db.getAccounts();
    return res.status(200).json({ user: accounts[0] });
  },
};
