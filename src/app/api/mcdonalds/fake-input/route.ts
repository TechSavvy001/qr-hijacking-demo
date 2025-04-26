import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { sessionId, email, type, timestamp } = body;

  const { error } = await supabase.from('fake_inputs').insert({
    session_id: sessionId,
    email,
    type,
    timestamp: new Date(timestamp).toISOString(),
  });

  if (error) {
    console.error('Fake input error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
