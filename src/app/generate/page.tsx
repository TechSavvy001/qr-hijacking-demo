'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QRCode from 'qrcode.react';

export default function QRGeneratorPage() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!url) return;
    setLoading(true);
    const res = await fetch('/api/bitly', {
      method: 'POST',
      body: JSON.stringify({ longUrl: url }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    setShortUrl(data.shortUrl);
    setLoading(false);
  };

  const downloadQR = () => {
    const canvas = document.querySelector('canvas');
    const pngUrl = canvas?.toDataURL('image/png')?.replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    link.href = pngUrl!;
    link.download = 'qr-code.png';
    link.click();
  };

  return (
    <main className="max-w-xl mx-auto mt-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>🎯 QR-Generator mit Bitly</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="url">Ziel-URL</Label>
            <Input
              id="url"
              placeholder="https://qr-hijacking-demo.vercel.app/fake-mcdonalds"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button onClick={generate} disabled={!url || loading}>
            {loading ? 'Erzeuge...' : 'Bitly-Link & QR generieren'}
          </Button>

          {shortUrl && (
            <div className="space-y-4 pt-4 border-t">
              <p>
                📎 <strong>Bitly-Link:</strong>{' '}
                <a href={shortUrl} className="underline text-blue-600" target="_blank">
                  {shortUrl}
                </a>
              </p>
              <div className="flex flex-col items-center gap-2">
                <QRCode value={shortUrl} size={200} />
                <Button variant="outline" onClick={downloadQR}>
                  QR-Code herunterladen
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
