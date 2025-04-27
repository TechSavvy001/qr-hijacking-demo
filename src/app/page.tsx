'use client';

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Korrekt weiterleiten auf die Fake-McDonald's-Seite
    window.location.replace("/fake-mcdonalds");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Sie werden weitergeleitet...</p>
    </div>
  );
}
