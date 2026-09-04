import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { getUserById, getProfileByUserId, updateProfile, replaceLinks } from "@/lib/models";

export async function PUT(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
  }

  const user = await getUserById(userId);
  if (!user) {
    return NextResponse.json({ error: "Benutzer nicht gefunden." }, { status: 404 });
  }

  const isTelelumi = user.username.toLowerCase() === "telelumi";

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
    badges,
    views,
  } = body;

  const updateData: Parameters<typeof updateProfile>[1] = {
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
  };

  // Only user "telelumi" can update badges
  if (isTelelumi && badges !== undefined) {
    updateData.badges = typeof badges === "string" ? badges : JSON.stringify(badges);
  }

  // Only user "telelumi" can manually adjust views
  if (isTelelumi && typeof views === "number") {
    updateData.views = Math.max(0, Math.floor(views));
  }

  await updateProfile(userId, updateData);

  const profile = await getProfileByUserId(userId);
  if (profile && Array.isArray(links)) {
    await replaceLinks(
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
