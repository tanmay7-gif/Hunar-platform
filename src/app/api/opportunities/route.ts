import { NextRequest, NextResponse } from "next/server";
import { OpportunityService } from "@/lib/server/db";

// GET /api/opportunities - List and filter opportunities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const type = searchParams.get("type") || undefined;
    const location = searchParams.get("location") || undefined;
    const search = searchParams.get("search") || undefined;
    const minBudget = searchParams.get("minBudget") ? Number(searchParams.get("minBudget")) : undefined;

    const opportunities = OpportunityService.getAll({
      category,
      type,
      location,
      search,
      minBudget
    });

    return NextResponse.json({
      success: true,
      count: opportunities.length,
      data: opportunities
    });
  } catch (error) {
    console.error("Error in GET /api/opportunities:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/opportunities - Post a new gig, commission, or mural project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.category) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: 'title' and 'category' are required."
        },
        { status: 400 }
      );
    }

    const newOpp = OpportunityService.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Opportunity published to Hunar Radar successfully.",
        data: newOpp
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/opportunities:", error);
    return NextResponse.json(
      { success: false, error: "Failed to publish opportunity" },
      { status: 500 }
    );
  }
}
