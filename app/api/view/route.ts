import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { incrementProfileViews } from "@/lib/models";
import { db, dbReady } from "@/lib/db";

// In-memory cache for IP + profileId cooldown
const recentViews = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const profileId = body?.profileId;
    if (!profileId || typeof profileId !== "string") {
      return NextResponse.json({ error: "Ungültige profileId" }, { status: 400 });
    }

    // 1. Bot detection
    const userAgent = req.headers.get("user-agent") || "";
    if (/bot|crawler|spider|curl|wget|python|postman|lighthouse/i.test(userAgent)) {
      return NextResponse.json({ counted: false, reason: "bot" });
    }

    // 2. Fetch profile to verify existence and get owner userId
    await dbReady;
    const res = await db.execute({
      sql: `SELECT id, userId, views FROM profiles WHERE id = ?`,
      args: [profileId],
    });
    const profile = res.rows[0];
    if (!profile) {
      return NextResponse.json({ error: "Profil nicht gefunden" }, { status: 404 });
    }

    // 3. Prevent self-view: check if logged in user is the profile owner
    const currentUserId = await getCurrentUserId();
    if (currentUserId && currentUserId === profile.userId) {
      return NextResponse.json({ counted: false, reason: "owner" });
    }

    // 4. Cookie check: 12-hour cooldown per profile
    const cookieKey = `pv_${profileId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 16)}`;
    const alreadyViewedCookie = req.cookies.get(cookieKey)?.value;
    if (alreadyViewedCookie) {
      return NextResponse.json({ counted: false, reason: "cookie_cooldown" });
    }

    // 5. IP check: 6-hour cooldown per IP + profile
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const cacheKey = `${ip}_${profileId}`;
    const now = Date.now();
    const lastView = recentViews.get(cacheKey);
    const IP_COOLDOWN = 6 * 60 * 60 * 1000; // 6 hours

    if (lastView && now - lastView < IP_COOLDOWN) {
      return NextResponse.json({ counted: false, reason: "ip_cooldown" });
    }

    // Record view in memory & increment in database
    recentViews.set(cacheKey, now);
    await incrementProfileViews(profileId);

    const newViews = Number(profile.views) + 1;
    const response = NextResponse.json({ counted: true, views: newViews });

    // Set 12-hour cookie
    response.cookies.set(cookieKey, "1", {
      path: "/",
      maxAge: 12 * 60 * 60,
      httpOnly: true,
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("View tracking error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
