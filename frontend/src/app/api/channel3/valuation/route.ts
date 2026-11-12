import { NextRequest, NextResponse } from "next/server";
import { Channel3Product, Channel3ValuationRequest, Channel3ValuationResponse } from "@/types";

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
  ],
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Channel3ValuationRequest;
    const { query, category, costOfMaterials, hoursToCraft, currency = "INR" } = body;

    const categoryKey = category && MOCK_CHANNEL3_BENCHMARKS[category]
      ? category
      : Object.keys(MOCK_CHANNEL3_BENCHMARKS).find((cat) =>
          query.toLowerCase().includes(cat.toLowerCase().split(" ")[0])
        ) || "Terracotta & Pottery";

    const baseList = MOCK_CHANNEL3_BENCHMARKS[categoryKey] || MOCK_CHANNEL3_BENCHMARKS["Terracotta & Pottery"];

    const benchmarks: Channel3Product[] = baseList.slice(0, 4).map((p, idx) => {
      if (query.trim().length > 3 && idx === 0) {
        return {
          ...p,
          title: `Factory-Cast Alternative to "${query.trim()}"`,
        };
      }
      return p;
    });

    const validPrices = benchmarks.map((b) => b.price).filter((p) => p > 0);
    const avgPrice =
      validPrices.length > 0
        ? Math.round(validPrices.reduce((a, b) => a + b, 0) / validPrices.length)
        : 2200;

    const avgPriceUsd = Number((avgPrice / 85).toFixed(2));
    const estimatedHours = hoursToCraft && hoursToCraft > 0 ? hoursToCraft : 8;
    const estimatedMaterials =
      costOfMaterials && costOfMaterials > 0 ? costOfMaterials : Math.round(avgPrice * 0.3);

    const fairCraftsmanFloor = Math.round(estimatedMaterials + estimatedHours * 280);
    const craftPremiumPercentage = 32;

    const roundTo50 = (val: number) => Math.round(val / 50) * 50;
    const suggestedMinPrice = roundTo50(Math.max(fairCraftsmanFloor, Math.round(avgPrice * 1.15)));
    const suggestedOptimalPrice = roundTo50(
      Math.max(fairCraftsmanFloor * 1.18, avgPrice * (1 + craftPremiumPercentage / 100))
    );
    const suggestedPremiumPrice = roundTo50(
      Math.max(fairCraftsmanFloor * 1.45, avgPrice * 1.55)
    );

    const reasoning =
      `Commercial factory equivalents (e.g. ${benchmarks[0]?.merchant || "Retail Store"} ` +
      `at ₹${avgPrice.toLocaleString("en-IN")}) use mass-production machine molds and synthetic binders. ` +
      `Your authentic handmade piece represents ~${estimatedHours} hours of skilled master handcrafting and natural materials. ` +
      `A ${craftPremiumPercentage}% authenticity premium protects a living wage of ₹280+/hr while ensuring fair market competitiveness.`;

    const valuation: Channel3ValuationResponse = {
      query,
      category,
      benchmarks,
      averageMarketPrice: avgPrice,
      averageMarketPriceUsd: avgPriceUsd,
      suggestedMinPrice,
      suggestedOptimalPrice,
      suggestedPremiumPrice,
      craftPremiumPercentage,
      currency,
      reasoning,
      artisanWageProtection: {
        floorWage: fairCraftsmanFloor,
        handmadeAuthenticityFactor: `+${craftPremiumPercentage}% Heritage & Living Wage Premium`,
      },
      isMock: true,
    };

    return NextResponse.json({ success: true, valuation }, { status: 200 });
  } catch (error: any) {
    console.error("[Channel3 Next.js Route] valuation error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to calculate valuation" },
      { status: 500 }
    );
  }
}

