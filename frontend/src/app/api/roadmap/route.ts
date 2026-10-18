import { NextRequest, NextResponse } from "next/server";
import { RoadmapService } from "@/lib/server/db";

// GET /api/roadmap - Fetch roadmap steps for craft
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const artForm = searchParams.get("artForm") || "Murals";

    const steps = RoadmapService.getStepsByCraft(artForm);
    const milestoneStates = RoadmapService.getMilestoneStates();

    return NextResponse.json({
      success: true,
      artForm,
      data: steps,
      milestoneStates
    });
  } catch (error) {
    console.error("Error in GET /api/roadmap:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/roadmap/toggle - Toggle milestone completion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.milestoneId) {
      return NextResponse.json(
        { success: false, error: "Missing required field: 'milestoneId'" },
        { status: 400 }
      );
    }

    const result = RoadmapService.toggleMilestone(body.milestoneId);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error in POST /api/roadmap:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
