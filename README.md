# QR-Code-Hijacking – Vertrauen in Schwarz-Weiß

Ein Uni-Projekt zur Demonstration, wie einfach QR-Codes im Alltag manipuliert und missbraucht werden können.  
Wir zeigen, wie ein vermeintlich harmloser QR-Code auf Fake-Seiten, Tracking-Mechanismen oder Social-Engineering-Angriffe führen kann – **rein zu Forschungs- und Aufklärungszwecken**.

---

## Projekt-Setup

### Voraussetzungen

- Node.js 18 oder höher
- Git
- Internetverbindung
- Supabase-Zugang (wird gestellt)

---

## Abhängigkeiten installieren

Du hast zwei Möglichkeiten:

### Standard (empfohlen)

Installiere alle benötigten Pakete mit einem einzigen Befehl aus der `package.json`:

```bash
npm install
```

### Manuelle Installation (optional – falls nötig)

Falls du die Pakete einzeln installieren möchtest, z. B. bei Problemen oder einem neuen Setup:

**Next.js + React + React-DOM**

```bash
npm install next react react-dom
```

**TailwindCSS + PostCSS + Autoprefixer**

```bash
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

> Dadurch werden die Dateien `tailwind.config.js` und `postcss.config.js` erstellt.

**Shadcn UI**

```bash
npx shadcn-ui@latest init
```

**Supabase-Client**

```bash
npm install @supabase/supabase-js
```

**`bcryptjs`**

```bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

```bash
npm install qrcode.react
```

```bash
npm install uuid
npm install --save-dev @types/uuid
```

---

### `.env.local` erstellen

Lege im Projektverzeichnis eine Datei namens `.env.local` an mit folgendem Inhalt:

```bash
SUPABASE_URL=https://dein-projekt.supabase.co
SUPABASE_ANON_KEY=dein-anon-key
DATABASE_URL=postgresql://postgres:passwort@host.supabase.co:5432/postgres
```

## Projekt starten

Sobald alle Pakete installiert und die `.env.local` eingerichtet ist, kannst du das Projekt starten mit:

```bash
npm run dev
```

## Hinweis

> Dieses Projekt dient ausschließlich zu Forschungs- und Lehrzwecken im Rahmen eines Hochschulprojekts.
> Es werden keine echten Passwörter oder Nutzerdaten gespeichert.
> Alle simulierten Angriffe sind rein demonstrativ und gesichert gegen Missbrauch.

---

## Projektteam

- Katharina Bäuml
- Juliane Hübner

## Hochschule / Semester

Fachbereich Wirtschaftsinformatik - Schwerpunkt Software Engineering
Seminar „Cybersecurity Awareness & Angriffsmodelle“
Sommersemester 2025
