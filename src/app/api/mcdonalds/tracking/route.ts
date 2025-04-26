import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unbekannt';
  const userAgent = request.headers.get('user-agent') || 'unbekannt';
  const referer = request.headers.get('referer') || 'direkt';

  console.log('Neuer Besucher:');
  console.log('IP:', ip);
  console.log('User-Agent:', userAgent);
  console.log('Referrer:', referer);
  console.log('Zeit:', new Date().toISOString());

  return new Response('OK', { status: 200 });
}
