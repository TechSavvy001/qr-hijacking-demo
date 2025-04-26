import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sessionId, totalClicks } = body;

  const { error } = await supabase.from('click_to_submit_log').insert([
    {
      session_id: sessionId,
      total_clicks: totalClicks,
      timestamp: new Date().toISOString(), // jetzt-Zeit nehmen
    },
  ]);

  if (error) {
    console.error('Fehler beim Speichern des Click-to-Submit-Logs:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
