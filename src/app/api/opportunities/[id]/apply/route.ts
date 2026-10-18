import { NextRequest, NextResponse } from "next/server";
import { OpportunityService } from "@/lib/server/db";

// POST /api/opportunities/[id]/apply - Express interest / submit bid
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.proposedRate || !body.pitch) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: 'proposedRate' and 'pitch' are required to submit an application."
        },
        { status: 400 }
      );
    }

    const application = OpportunityService.apply(id, {
      creatorId: body.creatorId || "creator-current",
      creatorName: body.creatorName || "Grassroots Creator",
      proposedRate: Number(body.proposedRate),
      pitch: body.pitch
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: `Opportunity with id '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Application & bid rate dispatched to client successfully.",
        data: application
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/opportunities/[id]/apply:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
