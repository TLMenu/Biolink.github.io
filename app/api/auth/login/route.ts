import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { getUserByEmail } from "@/lib/models";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = (body?.email ?? "").trim();
  const password = body?.password ?? "";

  const user = getUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "E-Mail oder Passwort falsch." }, { status: 401 });
  }

  await setSessionCookie(user.id);
  return NextResponse.json({ ok: true, username: user.username });
}
