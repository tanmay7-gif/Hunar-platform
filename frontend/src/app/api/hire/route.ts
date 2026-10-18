import { NextRequest, NextResponse } from "next/server";
import { BookingService } from "@/lib/server/db";

// POST /api/hire - Request a quote / commission inquiry directly for a creator
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.creatorId || !body.clientName || !body.clientPhone) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: 'creatorId', 'clientName', and 'clientPhone' are required."
        },
        { status: 400 }
      );
    }

    const booking = BookingService.createHireRequest({
      creatorId: body.creatorId,
      clientName: body.clientName,
      clientPhone: body.clientPhone,
      budget: Number(body.budget || 0),
      note: body.note || "Commission inquiry from Hunar Card"
    });

    return NextResponse.json(
      {
        success: true,
        message: "Hire / commission inquiry dispatched to artisan via SMS and WhatsApp.",
        data: booking
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/hire:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
