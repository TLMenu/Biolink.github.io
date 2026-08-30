# biolink

Eine eigene Biolink-Plattform im Stil von guns.lol — mit Nutzer-Registrierung,
individuell gestaltbaren Profilseiten (Hintergrund, Musik, Effekte, Custom CSS)
und Links unter `deinedomain.de/username`.

## Tech-Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **node:sqlite** — Node's eingebautes SQLite-Modul (kein externer DB-Server,
  keine native Binary nötig). Erfordert Node.js **22.5+**.
- Eigenes Auth-System: bcrypt-Passwort-Hashing + JWT-Session-Cookie (httpOnly)

## Setup

```bash
npm install
npm run dev
```

Die Seite läuft dann unter `http://localhost:3000`.

Beim ersten Start wird automatisch eine SQLite-Datenbank unter `data/app.db`
angelegt — es ist kein zusätzliches Datenbank-Setup nötig.

## Wichtig vor dem Live-Gang

1. **`.env` anpassen**: Ändere `JWT_SECRET` auf einen langen, zufälligen
   Wert (z.B. mit `openssl rand -hex 32` generieren). Der aktuelle Wert ist
   nur ein Platzhalter für die lokale Entwicklung.
2. **`data/app.db` sichern**: Regelmäßige Backups der SQLite-Datei einplanen.
3. Für Produktion: `npm run build && npm run start`.

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
  db.ts                 SQLite-Verbindung + Tabellen-Setup
  models.ts             DB-Zugriffsfunktionen (Users, Profiles, Links)
  auth.ts               Passwort-Hashing, JWT, Session-Cookie
components/
  ParticleEffect.tsx     Schnee-/Sterne-/Funken-Effekt auf Profilseiten
  AudioPlayer.tsx        Hintergrundmusik-Player mit Play/Pause-Button
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
