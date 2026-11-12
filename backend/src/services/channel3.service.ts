import { config } from "../config/config";
import {
  Channel3Product,
  Channel3ValuationRequest,
  Channel3ValuationResponse,
  Channel3TrendMetric,
} from "../models/types";

// Realistic fallback benchmark repository for major Indian craft categories
const MOCK_CHANNEL3_BENCHMARKS: Record<string, Channel3Product[]> = {
  "Terracotta & Pottery": [
    {
      id: "ch3-pottery-01",
      title: "Target Home Ceramic Tabletop Vase (Machine Molded)",
      price: 2125,
      priceUsd: 25.0,
      currency: "INR",
      merchant: "Target",
      imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80",
      url: "https://www.target.com/p/ceramic-table-vase",
      category: "Terracotta & Pottery",
      isCommercialAlternative: true,
    },
    {
      id: "ch3-pottery-02",
      title: "Wayfair Stoneware Decorative Planter (Factory Cast)",
      price: 2550,
      priceUsd: 30.0,
      currency: "INR",
      merchant: "Wayfair",
      imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=400&q=80",
      url: "https://www.wayfair.com/stoneware-planter",
      category: "Terracotta & Pottery",
      isCommercialAlternative: true,
    },
    {
      id: "ch3-pottery-03",
      title: "IKEA FÖRENLIG Earthenware Plant Pot (Mass Produced)",
      price: 1699,
      priceUsd: 19.99,
      currency: "INR",
      merchant: "IKEA",
      imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80",
      url: "https://www.ikea.com/forenlig-pot",
      category: "Terracotta & Pottery",
      isCommercialAlternative: true,
    },
    {
      id: "ch3-pottery-04",
      title: "West Elm Industrial Glazed Terracotta Carafe",
      price: 3230,
      priceUsd: 38.0,
      currency: "INR",
      merchant: "West Elm",
      imageUrl: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&q=80",
      url: "https://www.westelm.com/terracotta-carafe",
      category: "Terracotta & Pottery",
      isCommercialAlternative: true,
    },
  ],
  "Madhubani Folk Art": [
    {
      id: "ch3-art-01",
      title: "Society6 Madhubani Inspired Giclée Canvas Print",
      price: 2380,
      priceUsd: 28.0,
      currency: "INR",
      merchant: "Society6",
      imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80",
      url: "https://society6.com/madhubani-canvas",
      category: "Madhubani Folk Art",
      isCommercialAlternative: true,
    },
    {
      id: "ch3-art-02",
      title: "ArtStreet Indian Folk Art Framed Digital Lithograph",
      price: 1950,
      priceUsd: 22.95,
      currency: "INR",
      merchant: "Amazon Commercial",
      imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=400&q=80",
      url: "https://amazon.com/folk-art-print",
      category: "Madhubani Folk Art",
      isCommercialAlternative: true,
    },
    {
      id: "ch3-art-03",
      title: "Etsy Commercial Screenprinted Peacock Wall Hanging",
      price: 2200,
      priceUsd: 25.88,
      currency: "INR",
      merchant: "Etsy Direct",
      imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80",
      url: "https://etsy.com/peacock-wall-print",
      category: "Madhubani Folk Art",
      isCommercialAlternative: true,
    },
  ],
  "Handloom & Textiles": [
    {
      id: "ch3-tex-01",
      title: "Zara Jacquard Woven Poly-Acrylic Blend Stole",
      price: 3390,
      priceUsd: 39.9,
      currency: "INR",
      merchant: "Zara",
      imageUrl: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=400&q=80",
      url: "https://www.zara.com/jacquard-shawl",
      category: "Handloom & Textiles",
      isCommercialAlternative: true,
    },
    {
      id: "ch3-tex-02",
      title: "FabIndia Commercial Powerloom Cotton Dupatta",
      price: 2150,
      priceUsd: 25.3,
      currency: "INR",
      merchant: "FabIndia Retail",
      imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80",
      url: "https://www.fabindia.com/powerloom-dupatta",
      category: "Handloom & Textiles",
      isCommercialAlternative: true,
    },
    {
      id: "ch3-tex-03",
      title: "H&M Viscose Faux-Pashmina Winter Wrap",
      price: 2550,
      priceUsd: 30.0,
      currency: "INR",
      merchant: "H&M Trend",
      imageUrl: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=400&q=80",
      url: "https://www.hm.com/wrap-shawl",
      category: "Handloom & Textiles",
      isCommercialAlternative: true,
    },
  ],
  "Mural Design": [
    {
      id: "ch3-mural-01",
      title: "Wayfair Peel & Stick Heritage Indian Wall Mural Vinyl",
      price: 4200,
      priceUsd: 49.5,
      currency: "INR",
      merchant: "Wayfair",
      imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80",
      url: "https://www.wayfair.com/vinyl-mural",
      category: "Mural Design",
      isCommercialAlternative: true,
    },
    {
      id: "ch3-mural-02",
      title: "Urban Ladder CNC Printed Lotus Acrylic Wall Panel",
      price: 3600,
      priceUsd: 42.3,
      currency: "INR",
      merchant: "Urban Ladder",
      imageUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=400&q=80",
      url: "https://www.urbanladder.com/lotus-panel",
      category: "Mural Design",
      isCommercialAlternative: true,
    },
  ],
  "Bridal Mehndi": [
    {
      id: "ch3-mehndi-01",
      title: "Chemical Premix Commercial Henna Paste Cones (Pack of 12)",
      price: 1200,
      priceUsd: 14.1,
      currency: "INR",
      merchant: "Amazon Beauty",
      imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80",
      url: "https://amazon.com/henna-pack",
      category: "Bridal Mehndi",
      isCommercialAlternative: true,
    },
    {
      id: "ch3-mehndi-02",
      title: "Laser Cut Reusable Silicone Mehndi Stencil Templates",
      price: 1850,
      priceUsd: 21.75,
      currency: "INR",
      merchant: "Etsy Direct",
      imageUrl: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=400&q=80",
      url: "https://etsy.com/mehndi-stencils",
      category: "Bridal Mehndi",
      isCommercialAlternative: true,
    },
  ],
  "Woodwork & Stone": [
    {
      id: "ch3-wood-01",
      title: "IKEA CNC-Routered Sheesham Coaster & Box Set",
      price: 2450,
      priceUsd: 28.8,
      currency: "INR",
      merchant: "IKEA Living",
      imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80",
      url: "https://www.ikea.com/routered-box",
      category: "Woodwork & Stone",
      isCommercialAlternative: true,
    },
    {
      id: "ch3-wood-02",
      title: "Target Studio Wood Mandala Decorative Wall Plaque",
      price: 2950,
      priceUsd: 34.7,
      currency: "INR",
      merchant: "Target",
      imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=400&q=80",
      url: "https://www.target.com/wood-mandala",
      category: "Woodwork & Stone",
      isCommercialAlternative: true,
    },
  ],
};

export class Channel3Service {
  /**
   * Search Channel3 Product Data API or return high-fidelity fallback benchmarks
   */
  public static async searchMarketProducts(
    query: string,
    category?: string,
    limit = 5
  ): Promise<{ products: Channel3Product[]; isMock: boolean }> {
    const apiKey = config.CHANNEL3_API_KEY || config.channel3.apiKey;
    const apiBase = config.CHANNEL3_API_BASE || config.channel3.apiBase || "https://api.trychannel3.com/v1";

    const isDummyKey =
      !apiKey ||
      apiKey === "your_channel3_api_key" ||
      apiKey.startsWith("your_") ||
      apiKey === "dummy" ||
      apiKey === "placeholder";

    // 1. If key is present and not dummy, attempt live API query
    if (!isDummyKey) {
      try {
        const response = await fetch(`${apiBase}/search`, {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `${query} ${category || ""}`.trim(),
            limit,
          }),
        });

        if (response.ok) {
          const data = (await response.json()) as any;
          const items = Array.isArray(data.products)
            ? data.products
            : Array.isArray(data.items)
            ? data.items
            : Array.isArray(data)
            ? data
            : [];

          if (items.length > 0) {
            const mapped: Channel3Product[] = items.slice(0, limit).map((item: any, idx: number) => {
              const usdVal = item.price_usd || item.price || 25;
              const inrVal = item.price_inr || Math.round(usdVal * 85);
              return {
                id: item.id || `ch3-live-${idx}`,
                title: item.title || item.name || `${query} (Commercial)`,
                price: inrVal,
                priceUsd: Number(usdVal.toFixed(2)),
                currency: "INR",
                merchant: item.merchant || item.brand || item.store || "Commercial Retail",
                imageUrl: item.image_url || item.imageUrl || "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80",
                url: item.url || "https://trychannel3.com",
                category: category || "Artisan Craft",
                isCommercialAlternative: true,
              };
            });

            return { products: mapped, isMock: false };
          }
        } else {
          console.warn(`[Channel3 Service] API search returned status ${response.status}. Using intelligent mock benchmarks.`);
        }
      } catch (err) {
        console.warn("[Channel3 Service] Live query failed, falling back to mock benchmarks:", err);
      }
    }

    // 2. Fallback Mock Engine: Retrieve realistic benchmarks matching query or category
    const categoryKey = category && MOCK_CHANNEL3_BENCHMARKS[category]
      ? category
      : Object.keys(MOCK_CHANNEL3_BENCHMARKS).find((cat) =>
          query.toLowerCase().includes(cat.toLowerCase().split(" ")[0])
        ) || "Terracotta & Pottery";

    const baseList = MOCK_CHANNEL3_BENCHMARKS[categoryKey] || MOCK_CHANNEL3_BENCHMARKS["Terracotta & Pottery"];

    // Synthesize contextual items if query has specific craft terms
    const results: Channel3Product[] = baseList.slice(0, limit).map((p, idx) => {
      if (query.trim().length > 3 && idx === 0) {
        return {
          ...p,
          title: `Factory-Cast Alternative to "${query.trim()}"`,
        };
      }
      return p;
    });

    return { products: results, isMock: true };
  }

  /**
   * Calculate fair artisan pricing and live wage protections based on Channel3 benchmarks
   */
  public static async calculateArtisanFairPrice(
    params: Channel3ValuationRequest
  ): Promise<Channel3ValuationResponse> {
    const { query, category, costOfMaterials, hoursToCraft, currency = "INR" } = params;

    const { products: benchmarks, isMock } = await Channel3Service.searchMarketProducts(
      query,
      category,
      4
    );

    // Compute average market retail price of commercial alternatives
    const validPrices = benchmarks.map((b) => b.price).filter((p) => p > 0);
    const avgPrice =
      validPrices.length > 0
        ? Math.round(validPrices.reduce((a, b) => a + b, 0) / validPrices.length)
        : 2200;

    const avgPriceUsd = Number((avgPrice / 85).toFixed(2));

    // Calculate fair craftsman floor
    // Skilled master artisan living wage: minimum ₹280/hour
    const estimatedHours = hoursToCraft && hoursToCraft > 0 ? hoursToCraft : 8;
    const estimatedMaterials =
      costOfMaterials && costOfMaterials > 0 ? costOfMaterials : Math.round(avgPrice * 0.3);

    const fairCraftsmanFloor = Math.round(estimatedMaterials + estimatedHours * 280);

    // Calculate suggested pricing tiers with authenticity premium
    // Authentic handmade crafts command a 25% to 45% premium over factory molded alternatives
    const craftPremiumPercentage = 32; // +32% optimal authenticity factor
    const suggestedMinPrice = Math.max(fairCraftsmanFloor, Math.round(avgPrice * 1.15));
    const suggestedOptimalPrice = Math.round(
      Math.max(fairCraftsmanFloor * 1.18, avgPrice * (1 + craftPremiumPercentage / 100))
    );
    const suggestedPremiumPrice = Math.round(
      Math.max(fairCraftsmanFloor * 1.45, avgPrice * 1.55)
    );

    // Round nicely to nearest multiple of 50
    const roundTo50 = (val: number) => Math.round(val / 50) * 50;

    const finalMin = roundTo50(suggestedMinPrice);
    const finalOptimal = roundTo50(suggestedOptimalPrice);
    const finalPremium = roundTo50(suggestedPremiumPrice);

    const reasoning =
      `Commercial factory equivalents (e.g. ${benchmarks[0]?.merchant || "Retail Store"} ` +
      `at ₹${avgPrice.toLocaleString("en-IN")}) use mass-production machine molds and synthetic binders. ` +
      `Your authentic handmade piece represents ~${estimatedHours} hours of skilled master handcrafting and natural materials. ` +
      `A ${craftPremiumPercentage}% authenticity premium protects a living wage of ₹280+/hr while ensuring fair market competitiveness.`;

    return {
      query,
      category,
      benchmarks,
      averageMarketPrice: avgPrice,
      averageMarketPriceUsd: avgPriceUsd,
      suggestedMinPrice: finalMin,
      suggestedOptimalPrice: finalOptimal,
      suggestedPremiumPrice: finalPremium,
      craftPremiumPercentage,
      currency,
      reasoning,
      artisanWageProtection: {
        floorWage: fairCraftsmanFloor,
        handmadeAuthenticityFactor: `+${craftPremiumPercentage}% Heritage & Living Wage Premium`,
      },
      isMock,
    };
  }

  /**
   * Get platform-wide market trend metrics for MarketIntelligenceBar
   */
  public static getMarketTrends(): Channel3TrendMetric[] {
    return [
      {
        category: "Terracotta & Pottery",
        averageCommercialPrice: 2125,
        suggestedHandmadePrice: 2850,
        premiumPercentage: 34,
        sampleCommercialTitle: "Target Ceramic Machine-Molded Vase",
        merchant: "Target Home",
      },
      {
        category: "Brass Dhokra Sculptures",
        averageCommercialPrice: 3400,
        suggestedHandmadePrice: 4600,
        premiumPercentage: 35,
        sampleCommercialTitle: "AmazonBasics Die-Cast Brass Figurine",
        merchant: "Amazon Basics",
      },
      {
        category: "Handwoven Pashmina & Textiles",
        averageCommercialPrice: 2650,
        suggestedHandmadePrice: 3800,
        premiumPercentage: 43,
        sampleCommercialTitle: "Zara Jacquard Poly-Blend Stole",
        merchant: "Zara Trend",
      },
      {
        category: "Blue Pottery",
        averageCommercialPrice: 2250,
        suggestedHandmadePrice: 3050,
        premiumPercentage: 35,
        sampleCommercialTitle: "Crate & Barrel Screen-Printed Platter",
        merchant: "Crate & Barrel",
      },
      {
        category: "Madhubani Folk Art",
        averageCommercialPrice: 2175,
        suggestedHandmadePrice: 2900,
        premiumPercentage: 33,
        sampleCommercialTitle: "Society6 Giclée Litho Canvas Print",
        merchant: "Society6",
      },
    ];
  }
}

