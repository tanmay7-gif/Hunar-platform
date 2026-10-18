import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/server/db";

// GET /api/auth/me - Get demo accounts & current session info
export async function GET(request: NextRequest) {
  try {
    const demoAccounts = AuthService.getDemoAccounts();
    const userId = request.cookies.get("hunar_user_id")?.value;

    const currentUser = userId ? AuthService.getUserById(userId) : demoAccounts[0];

    return NextResponse.json({
      success: true,
      currentUser,
      demoPresets: demoAccounts
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
