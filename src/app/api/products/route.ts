import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/lib/server/db";

// GET /api/products - Query artwork catalog
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const city = searchParams.get("city") || undefined;
    const search = searchParams.get("search") || undefined;
    const deliveryFormat = searchParams.get("deliveryFormat") || undefined;
    const sellerId = searchParams.get("sellerId") || undefined;
    const status = searchParams.get("status") || undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;

    const products = ProductService.getAll({
      category,
      city,
      search,
      deliveryFormat,
      sellerId,
      status,
      minPrice,
      maxPrice
    });

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/products - Add product to artisan studio catalog
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.price || !body.category) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: 'title', 'price', and 'category' are required."
        },
        { status: 400 }
      );
    }

    const newProduct = ProductService.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Artwork product published to studio catalog successfully.",
        data: newProduct
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Products POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to publish product" },
      { status: 500 }
    );
  }
}
