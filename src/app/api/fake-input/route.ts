import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  console.log("Fake input received:", body); // nur Demo!

  // Nichts speichern – nur zeigen
  return NextResponse.json({ success: true });
}
