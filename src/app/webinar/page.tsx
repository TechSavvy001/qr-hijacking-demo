"use client";
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';


function Navbar() {
    return (
      <nav className="bg-gray-800 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">InnoMind AI Solutions</div>
          <div className="space-x-6">
            <a href="#" className="hover:text-gray-300">Startseite</a>
            <a href="#" className="hover:text-gray-300">Webinar</a>
            <a href="#" className="hover:text-gray-300">Leistungen</a>
            <a href="#" className="hover:text-gray-300">Team</a>
            <a href="#" className="hover:text-gray-300">Referenzen</a>
            <a href="#" className="hover:text-gray-300">Kontakt</a>
          </div>
        </div>
      </nav>
    );
  }
function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="max-w-4xl mx-auto text-center space-y-2">
        <p className="text-sm">© 2024 InnoMind AI Solutions - Innovation durch KI</p>
        <p className="text-xs text-gray-400">InnoMind AI Solutions GmbH - Königsallee 123, 40215 Düsseldorf - Tel: 0211  168 4580 - info@inomind-ai-solutions.de</p>
        <p className="text-xs text-gray-400">Impressum | Datenschutz | AGB</p>
      </div>
    </footer>
  );
}

export default function Webinar() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwörter stimmen nicht überein.');
      return;
    }

    try {
      const response = await fetch('/api/webinar/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      setMessage(response.ok ? 'Anmeldung erfolgreich! Du erhältst eine Bestätigungsmail.' : 'Fehler bei der Anmeldung.');
    } catch {
      setMessage('Serverfehler. Bitte später erneut versuchen.');
    }
  };

  return (
    <div>
      <Navbar />
      <main className="max-w-5xl mx-auto mt-10 p-6 space-y-12">
      <section className="text-center space-y-4">
      <div className="max-w-4xl mx-auto mt-10 p-6 space-y-8">
        <h1 className="text-4xl font-bold text-center">🚀 Künstliche Intelligenz: Grundlagen und Best Practices</h1>
        <p className="text-gray-700 text-lg leading-relaxed text-justify">
          In der heutigen digitalen Welt ist Künstliche Intelligenz (KI) der Motor für Wandel und Innovation. Sie transformiert Branchen, revolutioniert Geschäftsmodelle und verbessert Prozesse in Unternehmen jeder Größe. KI ermöglicht es, komplexe Aufgaben effizienter zu lösen, fundierte Entscheidungen zu treffen und neue Geschäftsfelder zu erschließen.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed text-justify">
          Doch wie funktioniert Künstliche Intelligenz wirklich? Welche Chancen und Risiken birgt sie für Unternehmen? Wie lassen sich Deepfakes erkennen, und wie können Sie KI sicher und gewinnbringend einsetzen? In unserer KI-Webinarreihe erhalten Sie praxisnahe Einblicke und Antworten auf diese Fragen.
        </p>

        <p className="text-gray-700 text-lg leading-relaxed text-justify">
          Die Webinarreihe richtet sich insbesondere an kleine und mittelständische Unternehmen und bietet eine verständliche Einführung in die Welt der KI. Sie erfahren, wie Sie Künstliche Intelligenz nutzen, Risiken minimieren und Chancen optimal ausschöpfen können.
        </p>
        </div>
        </section>

        <section className="space-y-8">

        <h2 className="text-2xl font-semibold mt-6">Was du lernen wirst:</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Einführung in die KI: Grundprinzipien und Funktionsweise</li>
          <li>Praktische Anwendungsbeispiele aus der Wirtschaft</li>
          <li> Datenschutz und Compliance: Worauf du achten musst</li>
          <li>Interaktive Live-Demo: KI in Aktion erleben</li>
        </ul>

        </section>
        

        <Card className="p-6 shadow-lg rounded-lg border border-gray-200">
          <CardHeader className="text-center">
            <h2 className="text-2xl font-semibold">Erstelle deinen Zugang</h2>
            <p className="text-gray-500">Sichere dir jetzt deinen Platz im Webinar!</p>
          </CardHeader>
          <CardContent className="mt-4 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Dein Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input type="email" placeholder="✉️ Deine E-Mail-Adresse" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Input type="password" placeholder="Passwort bestätigen" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <Button type="submit" className="w-full py-3 text-lg">Jetzt anmelden</Button>
            </form>
          </CardContent>
          {message && <CardFooter className="text-center text-red-500 mt-4">{message}</CardFooter>}
        </Card>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Zielgruppe & Nutzen</h2>
          <p className="text-gray-700">Dieses Webinar richtet sich an Geschäftsführer, IT-Leiter, Innovationsmanager und alle, die KI erfolgreich nutzen möchten.</p>
        </section>
        <h2 className="text-2xl font-semibold mt-8">Webinar-Agenda:</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>10:00 - 10:15: Begrüßung und Einführung</li>
          <li>10:15 - 10:45: Grundlagen der Künstlichen Intelligenz</li>
          <li>10:45 - 11:15: Anwendungsbeispiele aus der Praxis</li>
          <li>11:15 - 11:30: Datenschutz und Compliance</li>
          <li>11:30 - 12:00: Live-Demo und Q&A</li>
        </ul>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Häufige Fragen (FAQ)</h2>
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="faq1">
              <AccordionTrigger>Brauche ich Vorkenntnisse?</AccordionTrigger>
              <AccordionContent>Nein, das Webinar ist für Einsteiger geeignet.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq2">
              <AccordionTrigger>Erhalte ich eine Teilnahmebestätigung?</AccordionTrigger>
              <AccordionContent>Ja, nach Abschluss per E-Mail.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq3">
              <AccordionTrigger>Kann ich Fragen während des Webinars stellen?</AccordionTrigger>
              <AccordionContent>Ja, über die Chat-Funktion und in der Live-Demo.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq4">
              <AccordionTrigger>Was kostet die Teilnahme?</AccordionTrigger>
              <AccordionContent>Das Webinar ist kostenlos.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section className="space-y-8">
        <h2 className="text-2xl font-semibold mt-8">Unsere Referenten:</h2>
        <div className="flex space-x-8 items-center mt-6">
          <div className="text-center">
            <img src="/angela_schurr.jpg" alt="Angela Schurr" className="w-60 h-60 rounded-full object-cover mb-2" loading="lazy" />
            <p className="text-gray-700 font-semibold">Angela Schurr</p>
            <p className="text-gray-500 text-sm">Bereichsleiterin KI</p>
          </div>
          <div className="text-center">
            <img src="/luis_beckmann.jpg" alt="Luis Beckmann" className="w-60 h-60 rounded-full object-cover mb-2" loading="lazy" />
            <p className="text-gray-700 font-semibold">Luis Beckmann</p>
            <p className="text-gray-500 text-sm">KI-Consultant</p>
          </div>
        </div>

        </section>
        <section className="space-y-8">

        <div className="mt-8 text-center text-gray-500">
          📞 Fragen? Kontaktieren Sie uns: info@inomind-ai-solutions.de | 0211 168 4534
        </div>
        </section>

      <Footer />
      </main>

    </div>
  );
}
