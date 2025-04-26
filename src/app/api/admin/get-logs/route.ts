import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const responses = await Promise.all([
      supabase.from('fingerprint_log').select('*'),
      supabase.from('click_log').select('*'),
      supabase.from('scroll_log').select('*').order('timestamp', { ascending: false }).limit(100),
      supabase.from('email_input_log').select('*').order('timestamp', { ascending: false }).limit(100),
      supabase.from('email_blur_log').select('*').order('timestamp', { ascending: false }).limit(100),
      supabase.from('leave_logs').select('*').order('timestamp', { ascending: false }).limit(100),
      supabase.from('mouse_move_log').select('*').order('time_since_start', { ascending: false }).limit(100),
      supabase.from('fake_inputs').select('*').order('timestamp', { ascending: false }).limit(100),
      supabase.from('email_quality_logs').select('*').order('timestamp', { ascending: false }).limit(100),
      supabase.from('decision_speed_logs').select('*').order('time_to_submit_ms', { ascending: false }).limit(100),
      supabase.from('click_to_submit_log').select('*').order('total_clicks', { ascending: false }).limit(100),
      supabase.from('navigation_logs').select('*').order('timestamp', { ascending: false }).limit(100),
      supabase.from('session_time_logs').select('*').order('time_on_page_ms', { ascending: false }).limit(100),
    ]);

    const [
      fingerprints,
      clicks,
      scrolls,
      inputs,
      blurs,
      leaves,
      mouses,
      fakeInputs,
      emailQuality,
      decisionSpeed,
      clickToSubmit,
      navigation,
      sessionTimes,
    ] = responses.map(r => r.data ?? []);

    const errors = responses.filter(r => r.error);
    if (errors.length > 0) {
      console.error('Fehler beim Abrufen von Tabellen:', errors);
      return NextResponse.json({ error: 'Fehler beim Abrufen der Logs', details: errors }, { status: 500 });
    }

    return NextResponse.json({
      fingerprint: fingerprints,
      clicks,
      scrolls,
      inputs,
      blurs,
      leaves,
      mouse: mouses,
      fakeInputs,
      emailQuality,
      decisionSpeed,
      clickToSubmit,
      navigation,
      sessionTimes,
    });
  } catch (err) {
    console.error('Unbekannter Fehler im try/catch', err);
    return NextResponse.json({ error: 'Fehler beim Laden der Logs' }, { status: 500 });
  }
}
