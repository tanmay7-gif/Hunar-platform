import { NextRequest, NextResponse } from "next/server";
import { CreatorService } from "@/lib/server/db";

// GET /api/creators - List & filter creators
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const artForm = searchParams.get("artForm") || searchParams.get("category") || undefined;
    const city = searchParams.get("city") || undefined;
    const search = searchParams.get("search") || undefined;
    const verifiedOnly = searchParams.get("verified") === "true";

    const creators = CreatorService.getAll({
      artForm,
      city,
      search,
      verifiedOnly
    });

    return NextResponse.json({
      success: true,
      count: creators.length,
      data: creators
    });
  } catch (error) {
    console.error("Error in GET /api/creators:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/creators - Register / create a new creator profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.primaryArtForm) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: 'name' and 'primaryArtForm' are required."
        },
        { status: 400 }
      );
    }

    const newCreator = CreatorService.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Hunar Card creator profile registered successfully.",
        data: newCreator
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/creators:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process creator creation" },
      { status: 500 }
    );
  }
}
