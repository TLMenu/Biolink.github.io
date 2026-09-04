import { db, dbReady } from "./db";
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
  badges: string | null;
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

export async function createUser(
  username: string,
  email: string,
  passwordHash: string
): Promise<User> {
  await dbReady;
  const id = randomUUID();
  await db.execute({
    sql: `INSERT INTO users (id, username, email, passwordHash) VALUES (?, ?, ?, ?)`,
    args: [id, username.toLowerCase(), email.toLowerCase(), passwordHash],
  });

  const profileId = randomUUID();
  await db.execute({
    sql: `INSERT INTO profiles (id, userId, displayName) VALUES (?, ?, ?)`,
    args: [profileId, id, username],
  });

  return (await getUserById(id))!;
}

export async function getUserById(id: string): Promise<User | undefined> {
  await dbReady;
  const res = await db.execute({ sql: `SELECT * FROM users WHERE id = ?`, args: [id] });
  return res.rows[0] as unknown as User | undefined;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  await dbReady;
  const res = await db.execute({
    sql: `SELECT * FROM users WHERE email = ?`,
    args: [email.toLowerCase()],
  });
  return res.rows[0] as unknown as User | undefined;
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  await dbReady;
  const res = await db.execute({
    sql: `SELECT * FROM users WHERE username = ?`,
    args: [username.toLowerCase()],
  });
  return res.rows[0] as unknown as User | undefined;
}

export async function getProfileByUserId(userId: string): Promise<Profile | undefined> {
  await dbReady;
  const res = await db.execute({
    sql: `SELECT * FROM profiles WHERE userId = ?`,
    args: [userId],
  });
  return res.rows[0] as unknown as Profile | undefined;
}

export async function getLinksByProfileId(profileId: string): Promise<Link[]> {
  await dbReady;
  const res = await db.execute({
    sql: `SELECT * FROM links WHERE profileId = ? ORDER BY "order" ASC`,
    args: [profileId],
  });
  return res.rows as unknown as Link[];
}

export async function incrementProfileViews(profileId: string) {
  await dbReady;
  await db.execute({
    sql: `UPDATE profiles SET views = views + 1 WHERE id = ?`,
    args: [profileId],
  });
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
  badges: string;
  views: number;
}>;

export async function updateProfile(userId: string, data: ProfileUpdate) {
  await dbReady;
  const fields: string[] = [];
  const values: unknown[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    fields.push(`${key} = ?`);
    values.push(typeof value === "boolean" ? (value ? 1 : 0) : value);
  }
  if (fields.length === 0) return;

  values.push(userId);
  await db.execute({
    sql: `UPDATE profiles SET ${fields.join(", ")} WHERE userId = ?`,
    args: values as (string | number)[],
  });
}

export async function replaceLinks(
  profileId: string,
  links: { label: string; url: string; icon?: string }[]
) {
  await dbReady;
  await db.execute({ sql: `DELETE FROM links WHERE profileId = ?`, args: [profileId] });

  for (let index = 0; index < links.length; index++) {
    const link = links[index];
    await db.execute({
      sql: `INSERT INTO links (id, profileId, label, url, icon, "order") VALUES (?, ?, ?, ?, ?, ?)`,
      args: [randomUUID(), profileId, link.label, link.url, link.icon ?? null, index],
    });
  }
}
