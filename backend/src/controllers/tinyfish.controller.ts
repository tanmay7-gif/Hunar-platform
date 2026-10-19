import { Request, Response } from "express";
import { tinyFishService } from "../services/tinyfish";

export class TinyFishController {
  public static async getHealth(req: Request, res: Response) {
    res.json({
      success: true,
      service: "TinyFish Live Automation & Data Service",
      hasCredentials: tinyFishService.hasValidCredentials(),
      capabilities: [
        "Search API (Live Web Intelligence)",
        "Fetch API (Structured Markdown & JSON Extraction)",
        "Web Agent (Autonomous Multi-Step Browsing)",
        "Browser Infrastructure (Cloud Browser Execution Playwright/CDP)"
      ]
    });
  }

  public static async search(req: Request, res: Response) {
    try {
      const { query, options } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      const results = await tinyFishService.search(query, options);
      res.json({ success: true, query, results });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Search failed" });
    }
  }

  public static async fetch(req: Request, res: Response) {
    try {
      const { url, options } = req.body;
      if (!url) {
        return res.status(400).json({ error: "Target URL is required" });
      }
      const result = await tinyFishService.fetch(url, options);
      res.json({ success: true, result });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Fetch failed" });
    }
  }

  public static async runAgent(req: Request, res: Response) {
    try {
      const { goal, options } = req.body;
      if (!goal) {
        return res.status(400).json({ error: "Agent goal is required" });
      }
      const agentRun = await tinyFishService.runAgent(goal, options);
      res.json({ success: true, agentRun });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Agent execution failed" });
    }
  }

  public static async executeBrowser(req: Request, res: Response) {
    try {
      const { url, actions } = req.body;
      if (!url) {
        return res.status(400).json({ error: "Target URL is required" });
      }
      const browserResult = await tinyFishService.executeBrowser(url, actions);
      res.json({ success: true, browserResult });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Browser execution failed" });
    }
  }
}
