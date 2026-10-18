import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/server/db";

// POST /api/auth/login - Role-based authentication with 1-click presets
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const user = AuthService.login(email, password || "demo_pass");

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: `Logged in as ${user.name} (${user.role})`,
      data: user,
      redirectTo: user.role === "SELLER" ? "/dashboard/seller" : "/dashboard/customer"
    });

    // Set cookie for session persistence
    response.cookies.set("hunar_user_role", user.role, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax"
    });
    response.cookies.set("hunar_user_id", user.id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax"
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
