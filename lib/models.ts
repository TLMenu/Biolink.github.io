import { db } from "./db";
import { randomUUID } from "crypto";

export type User = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type Profile = {
  id: string;
  userId: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  backgroundUrl: string | null;
  backgroundType: string;
  backgroundColor: string;
  accentColor: string;
  audioUrl: string | null;
  audioAutoplay: number;
  cursorEffect: string;
  customCss: string | null;
  views: number;
};

export type Link = {
  id: string;
  profileId: string;
  label: string;
  url: string;
  icon: string | null;
  order: number;
};

const USERNAME_RE = /^[a-zA-Z0-9_-]{3,20}$/;

export function isValidUsername(username: string) {
  return USERNAME_RE.test(username);
}

export function createUser(username: string, email: string, passwordHash: string): User {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO users (id, username, email, passwordHash) VALUES (?, ?, ?, ?)`
  ).run(id, username.toLowerCase(), email.toLowerCase(), passwordHash);

  const profileId = randomUUID();
  db.prepare(`INSERT INTO profiles (id, userId, displayName) VALUES (?, ?, ?)`).run(
    profileId,
    id,
    username
  );

  return getUserById(id)!;
}

export function getUserById(id: string): User | undefined {
  return db.prepare(`SELECT * FROM users WHERE id = ?`).get(id) as User | undefined;
}

export function getUserByEmail(email: string): User | undefined {
  return db
    .prepare(`SELECT * FROM users WHERE email = ?`)
    .get(email.toLowerCase()) as User | undefined;
}

export function getUserByUsername(username: string): User | undefined {
  return db
    .prepare(`SELECT * FROM users WHERE username = ?`)
    .get(username.toLowerCase()) as User | undefined;
}

export function getProfileByUserId(userId: string): Profile | undefined {
  return db
    .prepare(`SELECT * FROM profiles WHERE userId = ?`)
    .get(userId) as Profile | undefined;
}

export function getLinksByProfileId(profileId: string): Link[] {
  return db
    .prepare(`SELECT * FROM links WHERE profileId = ? ORDER BY "order" ASC`)
    .all(profileId) as Link[];
}

export function incrementProfileViews(profileId: string) {
  db.prepare(`UPDATE profiles SET views = views + 1 WHERE id = ?`).run(profileId);
}

type ProfileUpdate = Partial<{
  displayName: string;
  bio: string;
  avatarUrl: string;
  backgroundUrl: string;
  backgroundType: string;
  backgroundColor: string;
  accentColor: string;
  audioUrl: string;
  audioAutoplay: boolean;
  cursorEffect: string;
  customCss: string;
}>;

export function updateProfile(userId: string, data: ProfileUpdate) {
  const fields: string[] = [];
  const values: unknown[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    fields.push(`${key} = ?`);
    values.push(typeof value === "boolean" ? (value ? 1 : 0) : value);
  }
  if (fields.length === 0) return;

  values.push(userId);
  db.prepare(`UPDATE profiles SET ${fields.join(", ")} WHERE userId = ?`).run(
    ...(values as never[])
  );
}

export function replaceLinks(
  profileId: string,
  links: { label: string; url: string; icon?: string }[]
) {
  db.prepare(`DELETE FROM links WHERE profileId = ?`).run(profileId);
  const stmt = db.prepare(
    `INSERT INTO links (id, profileId, label, url, icon, "order") VALUES (?, ?, ?, ?, ?, ?)`
  );
  links.forEach((link, index) => {
    stmt.run(randomUUID(), profileId, link.label, link.url, link.icon ?? null, index);
  });
}
