/**
 * @hunar/tinyfish
 * Dedicated TinyFish AI Web Connectivity & Autonomous Agent Microservice Package
 *
 * Capabilities:
 * - Search API: Live craft & GI registry search
 * - Fetch API: Clean markdown/JSON scraping & courier packaging SOPs
 * - Web Agent: Goal-driven multi-step courier rate comparisons & grant scouts
 * - Browser Infra: Cloud browser automation (Playwright/CDP) for rural hub discovery
 */

export * from "./client";
export * from "./services/search";
export * from "./services/fetch";
export * from "./services/web-agent";
export * from "./services/browser";
export * from "./mock";

import { tinyFishClient } from "./client";
import { tinyFishSearchService } from "./services/search";
import { tinyFishFetchService } from "./services/fetch";
import { tinyFishWebAgentService } from "./services/web-agent";
import { tinyFishBrowserService } from "./services/browser";

export const tinyFishPackage = {
  client: tinyFishClient,
  search: tinyFishSearchService,
  fetch: tinyFishFetchService,
  webAgent: tinyFishWebAgentService,
  browser: tinyFishBrowserService
};

export default tinyFishPackage;
