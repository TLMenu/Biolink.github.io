import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { getUserById, getProfileByUserId, getLinksByProfileId } from "@/lib/models";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ user: null });

  const user = await getUserById(userId);
  if (!user) return NextResponse.json({ user: null });

  const profile = await getProfileByUserId(userId);
  const links = profile ? await getLinksByProfileId(profile.id) : [];

  return NextResponse.json({
    user: { id: user.id, username: user.username, email: user.email },
    profile,
    links,
  });
}
