import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/server/db";

// POST /api/auth/register - Register a new Artisan or Patron account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, city } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Full name is required" },
        { status: 400 }
      );
    }

    if (!email || !email.trim() || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required" },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (role !== "SELLER" && role !== "CUSTOMER") {
      return NextResponse.json(
        { success: false, error: "Role must be either 'SELLER' or 'CUSTOMER'" },
        { status: 400 }
      );
    }

    const result = AuthService.register({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      city: city?.trim() || "Delhi NCR"
    });

    if (!result.success || !result.user) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to create account" },
        { status: 400 }
      );
    }

    const user = result.user;
    const response = NextResponse.json({
      success: true,
      message: `Account created for ${user.name} (${user.role})`,
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
  } catch (error: any) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
