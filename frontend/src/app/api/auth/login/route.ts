import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/server/db";

// POST /api/auth/login - Role-based authentication with 1-click presets
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Both email and password are required" },
        { status: 400 }
      );
    }

    const result = AuthService.login(email, password);

    if (!result.success || !result.user) {
      return NextResponse.json(
        { success: false, error: result.error || "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = result.user;
    const response = NextResponse.json({
      success: true,
      message: `Logged in as ${user.name} (${user.role})`,
      data: user,
      redirectTo:
        user.role === "SELLER" && !user.onboardingCompleted
          ? "/onboarding"
          : user.role === "SELLER"
          ? "/dashboard/seller"
          : "/dashboard/customer"
    });

    // Set cookies for session persistence
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
    response.cookies.set("hunar_user_name", encodeURIComponent(user.name), {
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
