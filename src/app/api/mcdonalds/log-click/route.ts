import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase-Verbindung herstellen
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!  
);

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { tagName, text, time } = body;

  const { error } = await supabase
    .from('click_log')
    .insert([{ tag_name: tagName, text: text, timestamp: new Date(time).toISOString() }]);

  if (error) {
    console.error('Fehler beim Speichern des Klick-Logs:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
