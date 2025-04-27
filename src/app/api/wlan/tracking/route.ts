import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

function parseUserAgent(ua: string) {
  let device = "Desktop";
  if (/Mobi|Android/i.test(ua)) device = "Mobile";
  else if (/Tablet|iPad/i.test(ua)) device = "Tablet";

  let browser = "Unbekannt";
  if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edge")) browser = "Edge";

  let os = "Unbekannt";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS X")) os = "macOS";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Android")) os = "Android";

  return { device, browser, os };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const userAgent = body.userAgent || "";
    const referrer = body.referrer || "direkter Zugriff";
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unbekannt";

    const { device, browser, os } = parseUserAgent(userAgent);

    const { error } = await supabase.from("wlan_tracking_log").insert([
      {
        ip_address: ip,
        user_agent: userAgent,
        referrer,
        device_type: device,
        browser,
        os,
      },
    ]);

    if (error) {
      console.error("Fehler beim Speichern im WLAN-Tracking:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Fehler im WLAN-Tracking-Handler:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
