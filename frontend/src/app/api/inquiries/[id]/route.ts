import { NextRequest, NextResponse } from "next/server";
import { InquiryService } from "@/lib/server/db";

// PUT /api/inquiries/[id] - Update inquiry lifecycle status (Under Review -> Crafting in Progress -> Dispatched)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, note } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status field is required" },
        { status: 400 }
      );
    }

    const updated = InquiryService.updateStatus(id, status, note);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Inquiry with id '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Inquiry tracker updated to '${status}'`,
      data: updated
    });
  } catch (error) {
    console.error("Inquiry status PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const PATCH = PUT;
