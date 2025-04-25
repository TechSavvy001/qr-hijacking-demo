'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function FakeMcDonaldsPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    // Optionale Tracking-API:
    await fetch('/api/fake-input', {
      method: 'POST',
      body: JSON.stringify({ type: 'gewinnspiel', email }),
      headers: { 'Content-Type': 'application/json' },
    });

    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-100 flex items-center justify-center p-6">
      <div className="bg-white max-w-md w-full p-8 rounded-lg shadow-md border border-yellow-400">
        <h1 className="text-2xl font-bold text-center mb-2 text-red-600">
          🍟 Jetzt 10 € Gutschein sichern!
        </h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          Nimm am Zufallsgewinnspiel teil und erhalte deinen Fast-Food-Gutschein per E-Mail.
        </p>

        {submitted ? (
          <div className="text-center text-green-600 font-semibold">
            Vielen Dank! Wenn du gewonnen hast, bekommst du deinen Gutschein per E-Mail.
          </div>
        ) : (
          <>
            <Label htmlFor="email" className="text-sm mb-1 block">
              E-Mail-Adresse:
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="z. B. du@mail.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />

            <Button
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
              onClick={handleSubmit}
              disabled={!email}
            >
              Jetzt teilnehmen
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
