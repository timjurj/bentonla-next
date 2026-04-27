import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();
  const secret = process.env.ADMIN_SECRET;
  
  if (!secret) {
    return NextResponse.json({ ok: false, error: "Admin secret not configured" }, { status: 500 });
  }
  
  if (password === secret) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin_auth", secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    });
    return response;
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}