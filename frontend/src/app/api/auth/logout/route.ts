import { NextResponse } from "next/server";

// POST /api/auth/logout - Clear session cookies
export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully"
  });

  // Clear session cookies
  response.cookies.set("hunar_user_role", "", { path: "/", maxAge: 0 });
  response.cookies.set("hunar_user_id", "", { path: "/", maxAge: 0 });
  response.cookies.set("hunar_user_name", "", { path: "/", maxAge: 0 });

  return response;
}
