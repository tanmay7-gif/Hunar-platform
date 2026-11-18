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

// POST /api/creators - Register / create or update a creator profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body provided." },
        { status: 400 }
      );
    }

    // Support batch registration / synchronization
    if (Array.isArray(body)) {
      const results = body.map((item) => CreatorService.create(item));
      return NextResponse.json(
        {
          success: true,
          count: results.length,
          data: results
        },
        { status: 201 }
      );
    }

    if (!body.name && !body.id && !body.username) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: 'name', 'id', or 'username' must be provided."
        },
        { status: 400 }
      );
    }

    // If only updates were provided with an existing id or username, update it
    const idOrUsername = body.id || body.username;
    if (idOrUsername && (!body.name || !body.primaryArtForm)) {
      const updated = CreatorService.update(idOrUsername, body);
      if (updated) {
        return NextResponse.json(
          {
            success: true,
            message: "Hunar Card creator profile updated successfully.",
            data: updated
          },
          { status: 200 }
        );
      }
    }

    const newCreator = CreatorService.create({
      ...body,
      name: body.name || "Artisan Creator",
      primaryArtForm: body.primaryArtForm || "Crafts & Studio Art"
    });

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

// PUT /api/creators - Update an existing creator profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const idOrUsername = body.id || body.username;

    if (!idOrUsername) {
      return NextResponse.json(
        { success: false, error: "Missing 'id' or 'username' in update payload." },
        { status: 400 }
      );
    }

    const updated = CreatorService.update(idOrUsername, body);
    if (!updated) {
      // Fallback: create if it didn't exist yet
      const created = CreatorService.create(body);
      return NextResponse.json(
        { success: true, message: "Created new creator profile.", data: created },
        { status: 201 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Creator profile updated successfully.",
      data: updated
    });
  } catch (error) {
    console.error("Error in PUT /api/creators:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update creator profile." },
      { status: 500 }
    );
  }
}
