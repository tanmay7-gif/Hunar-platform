import { NextResponse } from "next/server";
import { Channel3TrendMetric } from "@/types";

export async function GET() {
  const trends: Channel3TrendMetric[] = [
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
      category: "Handwoven Pashmina",
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

  return NextResponse.json({
    success: true,
    count: trends.length,
    trends,
  });
}

