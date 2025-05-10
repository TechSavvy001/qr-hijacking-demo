// src/app/api/webinar/register/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase-Client initialisieren
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// API-Route für POST-Requests
export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  try {
    const { error } = await supabase
      .from('webinar_registrations')
      .insert([{ name, email, password }]);

    if (error) {
      console.error('Fehler bei der Registrierung:', error);
      return NextResponse.json({ message: 'Fehler bei der Registrierung.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Registrierung erfolgreich!' });
  } catch (error) {
    console.error('Serverfehler bei der Registrierung:', error);
    return NextResponse.json({ message: 'Serverfehler. Bitte später erneut versuchen.' }, { status: 500 });
  }
}
