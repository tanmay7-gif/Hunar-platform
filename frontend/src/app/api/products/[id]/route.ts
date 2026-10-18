import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/lib/server/db";

// GET /api/products/[id] - Fetch single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = ProductService.getById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: `Product with id '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error("Product GET by ID error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product details
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = ProductService.update(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Product with id '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: updated
    });
  } catch (error) {
    console.error("Product PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Remove product from studio catalog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = ProductService.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: `Product with id '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product removed from catalog"
    });
  } catch (error) {
    console.error("Product DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
