export async function GET() {
    try {
      const res = await fetch(process.env.SUPABASE_URL as string);
      console.log('Ping:', res.status);
      return new Response('Supabase erreichbar');
    } catch (err) {
      console.error('Fehler beim Pingen von Supabase', err);
      return new Response('Supabase nicht erreichbar', { status: 500 });
    }
  }
  