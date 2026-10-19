import { Router, Request, Response } from "express";
import {
  tinyFishClient,
  tinyFishSearchService,
  tinyFishFetchService,
  tinyFishWebAgentService,
  tinyFishBrowserService
} from "@hunar/tinyfish";

const router = Router();

/**
 * GET /api/tinyfish/health
 */
router.get("/health", async (req: Request, res: Response) => {
  const health = await tinyFishClient.checkHealth();
  res.json({
    success: true,
    service: "@hunar/tinyfish Microservice Package",
    hasCredentials: tinyFishClient.hasValidCredentials(),
    capabilities: [
      "Search API (Live Craft & GI Registry Search)",
      "Fetch API (Structured Markdown/JSON & Courier SOPs)",
      "Web Agent (Autonomous Courier Rate Comparisons & Grants Scout)",
      "Browser Infra (Playwright/CDP Cloud Browser Automation for Rural Hubs)"
    ],
    details: health
  });
});

/**
 * POST /api/tinyfish/search
 */
router.post("/search", async (req: Request, res: Response) => {
  try {
    const { query, options } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }
    const results = await tinyFishSearchService.search(query, options);
    res.json({ success: true, query, results });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Search failed" });
  }
});

/**
 * POST /api/tinyfish/fetch
 */
router.post("/fetch", async (req: Request, res: Response) => {
  try {
    const { url, options } = req.body;
    if (!url) {
      return res.status(400).json({ error: "Target URL is required" });
    }
    const result = await tinyFishFetchService.fetch(url, options);
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Fetch failed" });
  }
});

/**
 * POST /api/tinyfish/courier-sop
 */
router.post("/courier-sop", async (req: Request, res: Response) => {
  try {
    const { category } = req.body;
    const sop = tinyFishFetchService.getCourierSOP(category || "terracotta-pottery");
    res.json({ success: true, sop });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Courier SOP failed" });
  }
});

/**
 * POST /api/tinyfish/agent
 */
router.post("/agent", async (req: Request, res: Response) => {
  try {
    const { goal, options } = req.body;
    if (!goal) {
      return res.status(400).json({ error: "Agent goal is required" });
    }
    const agentRun = await tinyFishWebAgentService.runAgent(goal, options);
    res.json({ success: true, agentRun });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Agent execution failed" });
  }
});

/**
 * POST /api/tinyfish/browser
 */
router.post("/browser", async (req: Request, res: Response) => {
  try {
    const { url, actions } = req.body;
    if (!url) {
      return res.status(400).json({ error: "Target URL is required" });
    }
    const browserResult = await tinyFishBrowserService.executeBrowser(url, actions);
    res.json({ success: true, browserResult });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Browser execution failed" });
  }
});

/**
 * GET /api/tinyfish/rural-hubs
 */
router.get("/rural-hubs", async (req: Request, res: Response) => {
  try {
    const hubs = tinyFishBrowserService.getRuralHubs();
    res.json({ success: true, count: hubs.length, hubs });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Rural hubs lookup failed" });
  }
});

export default router;
