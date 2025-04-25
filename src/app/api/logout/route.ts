import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies(); // ← await hinzufügen
  cookieStore.delete("admin");

  const redirectUrl = new URL("/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");

  return NextResponse.redirect(redirectUrl);
}
