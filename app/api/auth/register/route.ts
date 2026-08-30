import { NextRequest, NextResponse } from "next/server";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
  isValidUsername,
} from "@/lib/models";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const username = (body?.username ?? "").trim();
  const email = (body?.email ?? "").trim();
  const password = body?.password ?? "";

  if (!username || !email || !password) {
    return NextResponse.json({ error: "Bitte alle Felder ausfüllen." }, { status: 400 });
  }
  if (!isValidUsername(username)) {
    return NextResponse.json(
      { error: "Username: 3-20 Zeichen, nur Buchstaben, Zahlen, - und _." },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Passwort muss mind. 6 Zeichen lang sein." },
      { status: 400 }
    );
  }
  if (await getUserByUsername(username)) {
    return NextResponse.json({ error: "Username bereits vergeben." }, { status: 409 });
  }
  if (await getUserByEmail(email)) {
    return NextResponse.json({ error: "E-Mail bereits registriert." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser(username, email, passwordHash);
  await setSessionCookie(user.id);

  return NextResponse.json({ ok: true, username: user.username });
}
