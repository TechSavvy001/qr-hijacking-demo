import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!  
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sessionId } = body;

  const { error } = await supabase.from('mouse_move_log').insert({
    session_id: sessionId,
    x: body.x,
    y: body.y,
    time_since_start: body.time,
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
