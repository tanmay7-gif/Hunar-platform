import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/lib/server/db";

// POST /api/products/[id]/toggle - Toggle product status between Live and Draft
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = ProductService.toggleStatus(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: `Product with id '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Product status changed to ${product.status}`,
      data: product
    });
  } catch (error) {
    console.error("Product toggle error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
