import { NextRequest, NextResponse } from "next/server";
import { OpportunityService } from "@/lib/server/db";

// GET /api/opportunities/[id] - Fetch single opportunity
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const opp = OpportunityService.getById(id);

    if (!opp) {
      return NextResponse.json(
        { success: false, error: `Opportunity with id '${id}' not found` },
        { status: 404 }
      );
    }

    const applications = OpportunityService.getApplications(id);

    return NextResponse.json({
      success: true,
      data: {
        ...opp,
        applications
      }
    });
  } catch (error) {
    console.error("Error in GET /api/opportunities/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/opportunities/[id] - Update opportunity
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = OpportunityService.update(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Opportunity with id '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Opportunity updated successfully",
      data: updated
    });
  } catch (error) {
    console.error("Error in PUT /api/opportunities/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/opportunities/[id] - Delete opportunity
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = OpportunityService.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: `Opportunity with id '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Opportunity '${id}' deleted successfully`
    });
  } catch (error) {
    console.error("Error in DELETE /api/opportunities/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
