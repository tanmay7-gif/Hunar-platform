import { Request, Response } from "express";
import { db } from "../config/db";

export const AuthController = {
  login: (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Both email and password are required" });
      }

      const account = db.authenticate(email, password);
      if (account) {
        return res.status(200).json({
          success: true,
          user: account,
          token: `demo-jwt-token-${account.id}`,
        });
      }

      // Strict failure: do not fabricate fallback user or default to demo accounts
      return res.status(401).json({
        success: false,
        error: "Invalid email or password. Please check your credentials or register an account."
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication error";
      return res.status(500).json({ error: message });
    }
  },

  register: (req: Request, res: Response) => {
    try {
      const { name, email, password, role, city } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
      }

      const existing = db.authenticate(email);
      if (existing) {
        return res.status(400).json({ error: "An account with this email already exists" });
      }

      const newUser = db.registerAccount({
        name,
        email,
        password,
        role: role === "SELLER" ? "SELLER" : "CUSTOMER",
        city: city || "Delhi NCR",
      });

      return res.status(201).json({
        success: true,
        user: newUser,
        token: `demo-jwt-token-${newUser.id}`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration error";
      return res.status(500).json({ error: message });
    }
  },

  logout: (req: Request, res: Response) => {
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  },

  getCurrentUser: (req: Request, res: Response) => {
    const accounts = db.getAccounts();
    return res.status(200).json({ user: accounts[0] });
  },
};
