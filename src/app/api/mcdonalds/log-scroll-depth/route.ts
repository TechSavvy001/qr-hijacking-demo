import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { error } = await supabase.from('scroll_log').insert({
    session_id: body.sessionId,
    scroll_depth_percent: body.scrollDepthPercent,
    timestamp: new Date(body.timestamp).toISOString(),
  });

  if (error) {
    console.error('Supabase Fehler bei scroll_log:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
