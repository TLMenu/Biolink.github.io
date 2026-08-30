import { createClient, type Client } from "@libsql/client";
import path from "path";
import fs from "fs";

const globalForDb = globalThis as unknown as {
  __biolinkDb?: Client;
  __biolinkDbReady?: Promise<void>;
};

function makeClient(): Client {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (url) {
    // Remote Turso database (or any libSQL server) — used in production.
    return createClient({ url, authToken });
  }

  // Local fallback for development: a plain SQLite file on disk.
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const dbPath = path.join(dataDir, "app.db");
  return createClient({ url: `file:${dbPath}` });
}

export const db: Client = globalForDb.__biolinkDb ?? makeClient();

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  userId TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  displayName TEXT,
  bio TEXT,
  avatarUrl TEXT,
  backgroundUrl TEXT,
  backgroundType TEXT NOT NULL DEFAULT 'color',
  backgroundColor TEXT NOT NULL DEFAULT '#0f0f0f',
  accentColor TEXT NOT NULL DEFAULT '#7c3aed',
  audioUrl TEXT,
  audioAutoplay INTEGER NOT NULL DEFAULT 0,
  cursorEffect TEXT NOT NULL DEFAULT 'none',
  customCss TEXT,
  views INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS links (
  id TEXT PRIMARY KEY,
  profileId TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  "order" INTEGER NOT NULL DEFAULT 0
);
`;

async function initSchema() {
  for (const statement of SCHEMA.split(";").map((s) => s.trim()).filter(Boolean)) {
    await db.execute(statement);
  }
}

if (!globalForDb.__biolinkDb) {
  globalForDb.__biolinkDb = db;
  globalForDb.__biolinkDbReady = initSchema();
}

export const dbReady: Promise<void> = globalForDb.__biolinkDbReady ?? Promise.resolve();
