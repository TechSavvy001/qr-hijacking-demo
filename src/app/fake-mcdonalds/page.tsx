'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';

export default function McDStyledPage() {
    useEffect(() => {
    fetch('/api/mcdonalds/tracking');
    }, []);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [decisionStart, setDecisionStart] = useState<number | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const [emailAttempts, setEmailAttempts] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  // Session starten
  useEffect(() => {
    const id = uuidv4();
    setSessionId(id);
    setDecisionStart(Date.now());
    setSessionStartTime(Date.now());

    fetch('/api/mcdonalds/fingerprint', {
        method: 'POST',
        body: JSON.stringify({
          userAgent: navigator.userAgent,
          lang: navigator.language,
          screen: {
            width: window.screen.width,
            height: window.screen.height
          },
          referrer: document.referrer,
          timestamp: Date.now()
        }),
        headers: { 'Content-Type': 'application/json' }
      });
  }, []);

  // Klicks auf der Seite tracken (Buttons, Links)
  useEffect(() => {
    const trackClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setClickCount(prev => prev + 1);
  
      if (sessionId) {
        fetch('/api/mcdonalds/click-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            tagName: target.tagName,
            text: target.innerText,
            timestamp: Date.now(),
          }),
        });
      }
  
      // Navigation Klicks erfassen
      if (target.tagName === 'A' && sessionId) {
        fetch('/api/mcdonalds/log-navigation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            linkText: target.innerText,
            href: (target as HTMLAnchorElement).href,
            timestamp: Date.now(),
          }),
        });
      }
    };
  
    window.addEventListener('click', trackClick);
    return () => window.removeEventListener('click', trackClick);
  }, [sessionId]);
 

  // Scrolltiefe tracken
  useEffect(() => {
    let lastScrollLog = 0;
    const logScroll = () => {
      const now = Date.now();
      if (now - lastScrollLog < 1000) return; // Nur alle 1 Sekunde loggen
      lastScrollLog = now;

      const scrollDepthPercent = Math.min(
        (window.scrollY + window.innerHeight) / document.body.scrollHeight,
        1
      ) * 100;

      fetch('/api/mcdonalds/log-scroll-depth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          scrollDepthPercent,
          timestamp: Date.now(),
        }),
      });
    };

    window.addEventListener('scroll', logScroll);
    return () => window.removeEventListener('scroll', logScroll);
  }, [sessionId]);

  // Seitenverlassen (Abbrucherkennung)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!submitted && sessionStartTime && sessionId) {
        navigator.sendBeacon('/api/mcdonalds/leave-log', JSON.stringify({
          sessionId,
          email,
          action: 'left-before-submit',
          timestamp: Date.now(),
        }));
      }
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [sessionId, sessionStartTime, submitted, email]);
  
  // Absenden (Gewinnspiel-Teilnahme)
  const handleSubmit = async () => {
    if (!decisionStart || !sessionStartTime) return;

    // Entscheidungsgeschwindigkeit loggen
    await fetch('/api/mcdonalds/log-decision-speed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        timeToSubmitMs: Date.now() - decisionStart,
      }),
    });

    // Klicks bis Submit loggen
    await fetch('/api/mcdonalds/log-click-to-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        totalClicks: clickCount,
      }),
    });

    // Session abschließen (completed)
    await fetch('/api/mcdonalds/log-session-time', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        timeOnPageMs: Date.now() - sessionStartTime,
        completed: true,
      }),
    });

    // Gewinnspiel-Fake
    await fetch('/api/mcdonalds/fake-input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId,
          type: 'gewinnspiel', 
          email,
          timestamp: Date.now()
        }),
      }).then(res => {
        if (!res.ok) {
          console.error('Error sending fake input');
        }
      });
      

    setSubmitted(true);
  };
  
  return (
    <>
      {/* Navigation */}
      <nav className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-2 text-sm">
          {/* Left Section */}
          <div className="flex items-center gap-6">
            <Image src="/mcd-logo.png" alt="McDonald's Logo" width={80} height={80} />
            <div className="flex items-center gap-1">
              <span>Sprache</span>
            </div>
            <a href="#" className="hover:underline">Menu</a>
          <a href="#" className="hover:underline">App</a>
          <a href="#" className="hover:underline">Bonusprogramm</a>
          <a href="#" className="hover:underline">Order&Pay</a>
          <a href="#" className="text-[#DA291C] border-b-2 border-[#DA291C]">Angebote</a>
          <a href="#" className="hover:underline">McCafé</a>
          <a href="#" className="hover:underline">Familie</a>
          <a href="#" className="hover:underline">McDelivery®</a>

          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            <a href="#" className="hover:underline">Suche</a>
            <a href="#" className="text-[#DA291C] font-medium hover:underline flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#DA291C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a6 6 0 111.414-1.414l4.243 4.243a1 1 0 01-1.414 1.414z" />
              </svg>
              Restaurant finden
            </a>
          </div>
        </div>

        
      </nav>

      {/* Inhalt */}
      <main className="min-h-screen bg-white px-4 py-12 font-sans text-black">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-6">Unsere aktuellen Angebote</h1>
          <p className="text-base mb-2">
            Dich und deine Lieben lächeln zu sehen, bedeutet uns bei McDonalds® einfach alles! Wenn du auf der Suche nach etwas Besonderem bist, dann ist dies die richtige Seite für dich!
          </p>
          <p className="text-base mb-8">
            Gewinne einen exklusiven Gutschein für dein nächstes Menü. Schnell sein lohnt sich!
          </p>

        {/* Gewinnspiel – hervorgehoben */}
        <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-10 md:p-16 flex flex-col md:flex-row gap-10 items-center">
            {/* Textblock */}
            <div className="flex-1 space-y-4">
            <div className="inline-block bg-[#DA291C] text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                Gewinnspiel
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#DA291C]">
                Gewinne deinen 10 € McDonalds Gutschein!
            </h2>
            <p className="text-gray-700">
                Trag hier deine E-Mail ein – mit ein wenig Glück gehört der Gutschein bald dir!
            </p>

            {submitted ? (
                <div className="text-green-600 font-semibold">
                Danke! Du bekommst eine E-Mail, wenn du gewonnen hast.
                </div>
            ) : (
                <div className="space-y-4 pt-2">
                <label htmlFor="email" className="block font-medium">E-Mail-Adresse:</label>
                {/* E-Mail-Feld mit eingebauten Events */}
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value;
                        setEmail(value);
                        setEmailAttempts(prev => prev + 1);

                        // Email Input Log
                        if (sessionId) {
                        fetch('/api/mcdonalds/log-input', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                            sessionId,
                            emailFragment: value,
                            timestamp: Date.now(),
                            }),
                        });
                        }

                        // Zusätzlich Email-Quality loggen
                        const hasAt = value.includes('@');
                        const lengthOK = value.length >= 5;
                        const isValidFragment = hasAt && lengthOK;

                        if (sessionId) {
                        fetch('/api/mcdonalds/log-email-quality', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                            sessionId,
                            emailFragment: value,
                            isValidFragment,
                            attemptNumber: emailAttempts + 1,
                            timestamp: Date.now(),
                            }),
                        });
                        }
                    }}
                    onBlur={({ target }: React.FocusEvent<HTMLInputElement>) => {
                        const value = target.value;
                        if (sessionId) {
                          fetch('/api/mcdonalds/log-blur', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              sessionId,
                              email: value,
                              action: 'blur',
                              timestamp: Date.now(),
                            }),
                          });
                        }
                      }}             
                    placeholder="z. B. max@burger.de"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />

                <button
                    onClick={handleSubmit}
                    disabled={!email}
                    className="w-full md:w-auto bg-[#DA291C] text-white font-bold px-6 py-3 rounded-lg hover:bg-red-700 transition text-lg"
                >
                    Jetzt teilnehmen
                </button>
                </div>
            )}
            </div>

            {/* Bildblock */}
            <div className="relative h-48 w-full md:h-72 md:w-72 shrink-0">
            <Image
                src="/mcd-burger.png"
                alt="Gutschein Bild"
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
            />
            </div>
        </div>
        </section>
          {/* Weitere Angebote */}
            <section className="bg-white px-4 py-20">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Karte 1 */}
                <div className="bg-white">
                <div className="w-full h-60 relative mb-6">
                    <Image
                    src="/angebot-2for5.png" // <-- ersetze mit deinem echten Bild
                    alt="2 Produkte für Fr. 5.-"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                    />
                </div>
                <h3 className="text-xl font-extrabold mb-2">
                    Wähl deine Lieblings-Combo für nur Fr. 5.-
                </h3>
                <p className="text-gray-700 mb-4">
                    Das klingt schon fast zu gut, um wahr zu sein. Aber mit den 2for5Deals bekommst du tatsächlich zwei feine McDonalds® -Produkte zum Mini-Preis von nur Fr. 5.–. Wir wünschen guten Appetit.
                </p>
                <button className="bg-[#FFC72C] hover:bg-[#e6b421] text-black font-semibold py-2 px-4 rounded transition">
                    Jetzt geniessen!
                </button>
                </div>

                {/* Karte 2 */}
                <div className="bg-white">
                <div className="w-full h-60 relative mb-6">
                    <Image
                    src="/angebot-bigbang.png" // <-- ersetze mit deinem echten Bild
                    alt="Big Bang Menu"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-md"
                    />
                </div>
                <h3 className="text-xl font-extrabold mb-2">
                    Ganz nach deinem Budget – Die Big Bang Menus
                </h3>
                <p className="text-gray-700 mb-4">
                    Der Double Cheeseburger, der Filet-O-Fish®, der Chicken Paprika oder der Veggie Paprika – dass sich dein Hunger und dein Budget einig sind. <strong>Mit dem unschlagbaren Big Bang Menu für nur Fr. 9.50*.</strong>
                </p>
                <button className="bg-[#FFC72C] hover:bg-[#e6b421] text-black font-semibold py-2 px-4 rounded transition">
                    Spare jetzt
                </button>
                </div>
            </div>
            </section>
            <footer className="bg-white border-t mt-20">
                <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-2 md:grid-cols-5 gap-8 text-sm text-black">
                    <div>
                    <h4 className="font-bold mb-3">Über uns</h4>
                    <ul className="space-y-2">
                        <li>Unsere Geschichte</li>
                        <li>Franchising</li>
                        <li>Qualität</li>
                        <li>AGBs</li>
                        <li>Datenschutz</li>
                        <li>Impressum</li>
                        <li>Vorsicht vor Phishing-Fallen</li>
                    </ul>
                    </div>

                    <div>
                    <h4 className="font-bold mb-3">Engagement</h4>
                    <ul className="space-y-2">
                        <li>Engagement</li>
                        <li>Die Menschen</li>
                        <li>Sportförderprogramm</li>
                        <li>Ronald McDonald Kinderstiftung</li>
                        <li>Entwicklungsmöglichkeiten</li>
                    </ul>
                    </div>

                    <div>
                    <h4 className="font-bold mb-3">Services</h4>
                    <ul className="space-y-2">
                        <li>Services in unseren Restaurants</li>
                        <li>McDelivery®</li>
                        <li>McDrive®</li>
                        <li>Order&Pay</li>
                        <li>App</li>
                        <li>Bonusprogramm</li>
                        <li>Familie</li>
                        <li>Geburtstag feiern</li>
                        <li>Geschenkkarten</li>
                        <li>WLAN</li>
                    </ul>
                    </div>

                    <div>
                    <h4 className="font-bold mb-3">Newsroom</h4>
                    <ul className="space-y-2">
                        <li>Übersicht</li>
                        <li>Bilder und Videos</li>
                        <li>Medienmitteilungen</li>
                        <li>Zahlen und Fakten</li>
                    </ul>
                    </div>

                    <div>
                    <h4 className="font-bold mb-3">Kontakt</h4>
                    <ul className="space-y-2">
                        <li>FAQ</li>
                        <li>Jobs und Lehre</li>
                        <li>Kontaktformular</li>
                        <li>Medien Kontakt</li>
                    </ul>
                    </div>
                </div>

            {/* Socials & App Stores */}
            <div className="max-w-7xl mx-auto px-4 pb-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t pt-8">
            <div className="flex space-x-4">
                <Image src="/facebook.png" alt="Facebook" width={24} height={24} />
                <Image src="/x.png" alt="X/Twitter" width={24} height={24} />
                <Image src="/youtube.png" alt="YouTube" width={24} height={24} />
                <Image src="/instagram.png" alt="Instagram" width={24} height={24} />
            </div>
            <div className="flex space-x-4">
                <Image src="/appstore.png" alt="App Store" width={80} height={30} />
                <Image src="/googleplay.png" alt="Google Play" width={80} height={30} />
            </div>
            </div>

            {/* Copyright */}
            <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center text-xs text-gray-500 border-t">
            <div className="flex items-center space-x-1">
                <Image src="/mcd-logo.png" alt="McDonald's" width={16} height={16} />
                <span>®</span>
            </div>
            <span>© 2025 McDonalds® . Alle Rechte vorbehalten.</span>
            </div>

            </footer>
        </div>
      </main>
    </>
  );
}
