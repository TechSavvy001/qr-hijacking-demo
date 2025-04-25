import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { longUrl } = await req.json();
  const token = process.env.BITLY_API_TOKEN;

  if (!token) {
    return NextResponse.json({ error: "Bitly-Token fehlt" }, { status: 500 });
  }

  const response = await fetch("https://api-ssl.bitly.com/v4/shorten", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ long_url: longUrl }),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json({ error: data.message }, { status: 500 });
  }

  return NextResponse.json({ shortUrl: data.link });
}
