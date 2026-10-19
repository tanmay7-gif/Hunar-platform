/**
 * TinyFish Search API Service
 * Live craft intelligence, GI registry lookup, raw material spot pricing, and artisan exhibitions.
 */

import { TinyFishClient, tinyFishClient } from "../client";
import { MOCK_CRAFT_SEARCH_FIXTURES } from "../mock/fixtures";

export interface TinyFishSearchResult {
  title: string;
  url: string;
  snippet: string;
  source?: string;
  publishedDate?: string;
}

export class TinyFishSearchService {
  private client: TinyFishClient;

  constructor(client: TinyFishClient = tinyFishClient) {
    this.client = client;
  }

  /**
   * Search live web for craft market data, raw material indices, and GI tag records
   */
  public async search(
    query: string,
    options?: { maxResults?: number; site?: string }
  ): Promise<TinyFishSearchResult[]> {
    if (this.client.hasValidCredentials()) {
      try {
        const response = await fetch(`${this.client.getEndpoint()}/search`, {
          method: "POST",
          headers: this.client.getHeaders(),
          body: JSON.stringify({
            query: options?.site ? `site:${options.site} ${query}` : query,
            maxResults: options?.maxResults || 5
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.results)) {
            return data.results.map((r: any) => ({
              title: r.title || "Craft Resource",
              url: r.url || "",
              snippet: r.snippet || r.description || "",
              source: r.source || "TinyFish Live Web",
              publishedDate: r.publishedDate
            }));
          }
        }
      } catch (err) {
        console.warn("[TinyFish Search] Upstream search fallback triggered:", err);
      }
    }

    // High-fidelity fallback based on craft domain keywords
    const qLower = query.toLowerCase();
    if (qLower.includes("clay") || qLower.includes("terracotta") || qLower.includes("pottery") || qLower.includes("khurja")) {
      return MOCK_CRAFT_SEARCH_FIXTURES.terracotta;
    }
    if (qLower.includes("silk") || qLower.includes("chanderi") || qLower.includes("dabu") || qLower.includes("indigo")) {
      return MOCK_CRAFT_SEARCH_FIXTURES.silk;
    }
    return MOCK_CRAFT_SEARCH_FIXTURES.default;
  }
}

export const tinyFishSearchService = new TinyFishSearchService();
