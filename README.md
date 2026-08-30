# biolink

Eine eigene Biolink-Plattform im Stil von guns.lol — mit Nutzer-Registrierung,
individuell gestaltbaren Profilseiten (Hintergrund, Musik, Effekte, Custom CSS)
und Links unter `deinedomain.de/username`.

## Tech-Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **libSQL / Turso** (`@libsql/client`) — SQLite-kompatible Datenbank.
  Lokal läuft sie einfach als Datei (`data/app.db`), in Produktion (z.B. auf
  Vercel) verbindet sie sich zu einer gehosteten Turso-Datenbank — nötig,
  weil serverlose Plattformen wie Vercel kein dauerhaft beschreibbares
  Dateisystem haben.
- Eigenes Auth-System: bcrypt-Passwort-Hashing + JWT-Session-Cookie (httpOnly)

## Lokales Setup

```bash
npm install
npm run dev
```

Ohne weitere Konfiguration läuft die App unter `http://localhost:3000` und
legt automatisch eine lokale SQLite-Datei unter `data/app.db` an.

## Live-Deploy auf Vercel

Serverlose Plattformen wie Vercel haben **kein dauerhaft beschreibbares
Dateisystem** — deshalb braucht die App dort eine gehostete Datenbank statt
der lokalen SQLite-Datei. Wir nutzen dafür **Turso** (kostenloser Tier,
SQLite-kompatibel):

1. Auf [turso.tech](https://turso.tech) registrieren (oder die Turso-CLI
   nutzen: `curl -sSfL https://get.tur.so/install.sh | bash`)
2. Datenbank erstellen: `turso db create biolink`
3. Verbindungsdaten holen:
   - `turso db show biolink --url` → das ist `TURSO_DATABASE_URL`
   - `turso db tokens create biolink` → das ist `TURSO_AUTH_TOKEN`
4. In den Vercel-Projekteinstellungen unter **Environment Variables**
   hinzufügen:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `JWT_SECRET` (ein langer, zufälliger Wert, z.B. mit `openssl rand -hex 32`)
5. Neu deployen (Redeploy in Vercel) — danach funktionieren Registrierung,
   Login und das Dashboard live und dauerhaft.

Ohne `TURSO_DATABASE_URL` fällt die App automatisch auf eine lokale
SQLite-Datei zurück — praktisch für lokale Entwicklung, aber **nicht**
für den Vercel-Live-Betrieb geeignet.

## Projektstruktur

```
app/
  page.tsx              Landingpage
  register/, login/     Auth-Seiten
  dashboard/             Profil-Editor (geschützt, siehe middleware.ts)
  [username]/            Öffentliche Profilseite
  api/
    auth/register|login|logout   Auth-Endpunkte
    me                  Aktuell eingeloggter Nutzer + Profil
    profile             Profil & Links aktualisieren (PUT)
lib/
  db.ts                  libSQL-Verbindung + Tabellen-Setup
  models.ts              DB-Zugriffsfunktionen (Users, Profiles, Links)
  auth.ts                Passwort-Hashing, JWT, Session-Cookie
components/
  ParticleEffect.tsx     Schnee-/Sterne-/Funken-Effekt auf Profilseiten
  AudioPlayer.tsx         Hintergrundmusik-Player mit Play/Pause-Button
middleware.ts             Schützt /dashboard (Redirect zu /login ohne Session)
```

## Funktionen

- Registrierung (Username + E-Mail + Passwort), Login, Logout
- Dashboard: Anzeigename, Bio, Avatar-URL, Hintergrund (Farbe / Bild / Video /
  GIF via URL), Akzentfarbe, Cursor-/Partikel-Effekt, Custom CSS,
  Hintergrundmusik (URL + Autoplay-Toggle), beliebig viele Links
- Öffentliche Profilseite mit View-Counter

## Mögliche nächste Schritte

- Datei-Uploads statt reiner URL-Felder (z.B. via UploadThing oder S3)
- Discord-OAuth-Login zusätzlich zu E-Mail/Passwort
- Live-Discord-Status-Anzeige (z.B. über die Lanyard-API)
- Custom-Domain-Unterstützung
- Passwort-Reset per E-Mail
- Rate-Limiting auf den Auth-Routen
