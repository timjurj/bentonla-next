import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();
  if (password === process.env.ADMIN_SECRET) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin_auth", process.env.ADMIN_SECRET!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    return response;
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}