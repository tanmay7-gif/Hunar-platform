import { NextResponse } from "next/server";
import { StatsService } from "@/lib/server/db";

// GET /api/stats - Platform metrics and live counters
export async function GET() {
  try {
    const stats = StatsService.getSummary();
    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Error in GET /api/stats:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
