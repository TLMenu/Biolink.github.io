import { DatabaseSync } from "node:sqlite";
import path from "path";
import fs from "fs";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "app.db");

// Reuse a single connection across hot reloads in dev
const globalForDb = globalThis as unknown as { __biolinkDb?: DatabaseSync };

export const db: DatabaseSync =
  globalForDb.__biolinkDb ?? new DatabaseSync(dbPath);

if (!globalForDb.__biolinkDb) {
  globalForDb.__biolinkDb = db;

  db.exec(`
    PRAGMA journal_mode = WAL;

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
  `);
}
