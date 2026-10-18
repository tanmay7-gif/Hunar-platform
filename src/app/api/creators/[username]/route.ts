import { NextRequest, NextResponse } from "next/server";
import { CreatorService } from "@/lib/server/db";

// GET /api/creators/[username] - Fetch single creator details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const creator = CreatorService.getByUsername(username);

    if (!creator) {
      return NextResponse.json(
        { success: false, error: `Creator with username '${username}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: creator
    });
  } catch (error) {
    console.error("Error in GET /api/creators/[username]:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/creators/[username] - Update creator profile details
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const body = await request.json();

    const updated = CreatorService.update(username, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Creator with username '${username}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Creator profile updated successfully",
      data: updated
    });
  } catch (error) {
    console.error("Error in PUT /api/creators/[username]:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/creators/[username] - Delete creator
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const creator = CreatorService.getByUsername(username);

    if (!creator) {
      return NextResponse.json(
        { success: false, error: "Creator not found" },
        { status: 404 }
      );
    }

    CreatorService.delete(creator.id);

    return NextResponse.json({
      success: true,
      message: `Creator '${username}' removed successfully`
    });
  } catch (error) {
    console.error("Error in DELETE /api/creators/[username]:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
