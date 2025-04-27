import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const longUrl = body.url;

    const bitlyResponse = await fetch("https://api-ssl.bitly.com/v4/shorten", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.BITLY_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        long_url: longUrl,
      }),
    });

    const data = await bitlyResponse.json();

    if (bitlyResponse.status !== 200) {
      console.error("Bitly Fehler:", data);
      return NextResponse.json({ success: false, error: data.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, shortUrl: data.link });
  } catch (err) {
    console.error("Fehler im Bitly-Handler:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
