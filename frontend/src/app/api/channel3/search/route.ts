import { NextRequest, NextResponse } from "next/server";
import { Channel3Product } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { query?: string; category?: string; limit?: number };
    const query = body.query || "Pottery";
    const limit = body.limit || 5;

    const mockProducts: Channel3Product[] = [
      {
        id: "ch3-item-01",
        title: `Target Home Alternative: ${query}`,
        price: 2125,
        priceUsd: 25.0,
        currency: "INR",
        merchant: "Target",
        imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80",
        url: "https://target.com",
        isCommercialAlternative: true,
      },
      {
        id: "ch3-item-02",
        title: `Wayfair Mass-Market Alternative: ${query}`,
        price: 2550,
        priceUsd: 30.0,
        currency: "INR",
        merchant: "Wayfair",
        imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=400&q=80",
        url: "https://wayfair.com",
        isCommercialAlternative: true,
      },
      {
        id: "ch3-item-03",
        title: `IKEA Earthenware Industrial Line: ${query}`,
        price: 1699,
        priceUsd: 19.99,
        currency: "INR",
        merchant: "IKEA",
        imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80",
        url: "https://ikea.com",
        isCommercialAlternative: true,
      },
    ];

    return NextResponse.json({
      success: true,
      count: mockProducts.length,
      products: mockProducts.slice(0, limit),
      isMock: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Search error" },
      { status: 500 }
    );
  }
}

