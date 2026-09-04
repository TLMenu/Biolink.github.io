import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { getProfileByUserId, updateProfile, replaceLinks } from "@/lib/models";

export async function PUT(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Ungültige Daten." }, { status: 400 });

  const {
    displayName,
    bio,
    avatarUrl,
    backgroundUrl,
    backgroundType,
    backgroundColor,
    accentColor,
    audioUrl,
    audioAutoplay,
    cursorEffect,
    customCss,
    links,
  } = body;

  updateProfile(userId, {
    displayName,
    bio,
    avatarUrl,
    backgroundUrl,
    backgroundType,
    backgroundColor,
    accentColor,
    audioUrl,
    audioAutoplay,
    cursorEffect,
    customCss,
  });

  const profile = getProfileByUserId(userId);
  if (profile && Array.isArray(links)) {
    replaceLinks(
      profile.id,
      links
        .filter((l: { label?: string; url?: string }) => l.label && l.url)
        .map((l: { label: string; url: string; icon?: string }) => ({
          label: l.label,
          url: l.url,
          icon: l.icon,
        }))
    );
  }

  return NextResponse.json({ ok: true });
}
