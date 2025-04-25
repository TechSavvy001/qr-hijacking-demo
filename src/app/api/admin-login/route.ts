import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import supabase from "@/lib/supabase";

export async function POST(req: Request) {
  const { password } = await req.json();

  // Admin aus Supabase holen (z. B. erstes Adminkonto)
  const { data: admin } = await supabase.from("admins").select("*").limit(1).single();

  if (!admin) return NextResponse.json({ error: "Kein Admin" }, { status: 401 });

  const valid = await bcrypt.compare(password, admin.password_hash);

  if (!valid) return NextResponse.json({ error: "Falsches Passwort" }, { status: 401 });

  // Session-Cookie setzen
  const cookieStore = await cookies();
  cookieStore.set("admin", "true", { httpOnly: true, path: "/" });
  
  return NextResponse.json({ success: true });
}
