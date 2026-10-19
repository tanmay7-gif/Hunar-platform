# @hunar/tinyfish

Dedicated TinyFish AI Web Connectivity & Autonomous Agent Microservice Package for the **Hunar Platform**.

---

## Architecture & Capabilities

The package isolates all external web intelligence, extraction, and autonomous browser workflows into 4 decoupled services:

1. **Search API (`services/search.ts`)**:
   - Queries live web intelligence for craft trends, GI tag registries, and raw material spot rates (e.g. Khurja clay, Chanderi mulberry silk yarn, Bagru indigo dye).
2. **Fetch API (`services/fetch.ts`)**:
   - Structured scraping of external craft portfolios (Etsy, Instagram, blogs) into clean Markdown and JSON.
   - Carrier standard packaging Operating Procedures (SOPs) for fragile studio pottery and handloom textiles.
3. **Web Agent (`services/web-agent.ts`)**:
   - Autonomous multi-step goal execution comparing courier rates across India Post (Rural Dawk), Delhivery, and BlueDart.
   - Autonomous scout agent for national handicraft grants and exhibition allocations (handicrafts.nic.in, Dastkar, TRIFED).
4. **Browser Infrastructure (`services/browser.ts`)**:
   - Remote Playwright/CDP cloud browser sessions with viewport captures and devtools audits.
   - Active rural feeder hub discovery across handicraft clusters.

---

## Usage

```typescript
import {
  tinyFishClient,
  tinyFishSearchService,
  tinyFishFetchService,
  tinyFishWebAgentService,
  tinyFishBrowserService
} from "@hunar/tinyfish";

// 1. Live Craft Search
const searchResults = await tinyFishSearchService.search("Khurja Terracotta Raw Clay Wholesale");

// 2. Structured Page Scraping
const productDetails = await tinyFishFetchService.fetch("https://etsy.com/listing/handmade-madhubani");

// 3. Courier Rate Comparison Agent
const agentRun = await tinyFishWebAgentService.runAgent("Compare courier rates for 3.5kg pottery from Khurja to Delhi");

// 4. Cloud Browser Execution
const browserResult = await tinyFishBrowserService.executeBrowser("https://ipindia.gov.in/gi-records");
```
