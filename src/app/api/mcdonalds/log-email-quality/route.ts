import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { error } = await supabase.from('email_quality_logs').insert({
    session_id: body.sessionId,
    email_fragment: body.emailFragment,
    is_valid_fragment: body.isValidFragment,
    attempt_number: body.attemptNumber,
    timestamp: new Date(body.timestamp).toISOString(),
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
