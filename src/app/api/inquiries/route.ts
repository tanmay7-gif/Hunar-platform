import { NextRequest, NextResponse } from "next/server";
import { InquiryService } from "@/lib/server/db";

// GET /api/inquiries - List inquiries for seller or customer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");
    const sellerId = searchParams.get("sellerId");

    let inquiries;
    if (customerId) {
      inquiries = InquiryService.getByCustomer(customerId);
    } else if (sellerId) {
      inquiries = InquiryService.getBySeller(sellerId);
    } else {
      inquiries = InquiryService.getAll();
    }

    return NextResponse.json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    console.error("Inquiries GET error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/inquiries - Dispatch commission inquiry or product order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.requirements || !body.sellerId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: 'requirements' and 'sellerId' are required."
        },
        { status: 400 }
      );
    }

    const newInquiry = InquiryService.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry dispatched to artisan studio inbox.",
        data: newInquiry
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Inquiries POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch inquiry" },
      { status: 500 }
    );
  }
}
