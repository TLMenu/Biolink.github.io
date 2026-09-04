import { notFound } from "next/navigation";
import {
  getUserByUsername,
  getProfileByUserId,
  getLinksByProfileId,
} from "@/lib/models";
import { getCurrentUserId } from "@/lib/auth";
import ParticleEffect from "@/components/ParticleEffect";
import AudioPlayer from "@/components/AudioPlayer";
import ViewTracker from "@/components/ViewTracker";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) notFound();

  const profile = await getProfileByUserId(user.id);
  if (!profile) notFound();

  const links = await getLinksByProfileId(profile.id);

  // Check if the current viewer is the profile owner
  const currentUserId = await getCurrentUserId();
  const isOwner = !!(currentUserId && currentUserId === user.id);

  // Badges logic: strictly restricted to "telelumi"
  let badges = { verified: false, og: false, premium: false };
  if (profile.badges && user.username.toLowerCase() === "telelumi") {
    try {
      badges = typeof profile.badges === "string" ? JSON.parse(profile.badges) : profile.badges;
    } catch {
      // ignore
    }
  }

  const bgStyle: React.CSSProperties =
    profile.backgroundType === "color"
      ? { backgroundColor: profile.backgroundColor }
      : {};

  return (
    <main
      className="min-h-screen relative flex items-center justify-center px-6 py-12 overflow-hidden"
      style={bgStyle}
    >
      {profile.backgroundType === "image" && profile.backgroundUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.backgroundUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {profile.backgroundType === "gif" && profile.backgroundUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.backgroundUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {profile.backgroundType === "video" && profile.backgroundUrl && (
        <video
          src={profile.backgroundUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/40" />

      <ParticleEffect type={profile.cursorEffect} />

      <div className="profile-card relative z-10 w-full max-w-sm bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center text-white">
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt={profile.displayName ?? user.username}
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2"
            style={{ borderColor: profile.accentColor }}
          />
        ) : (
          <div
            className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold border-2"
            style={{ borderColor: profile.accentColor }}
          >
            {(profile.displayName ?? user.username).slice(0, 2).toUpperCase()}
          </div>
        )}

        <div className="flex items-center justify-center gap-2 mb-1">
          <h1 className="text-xl font-bold">{profile.displayName || user.username}</h1>
          {(badges.verified || badges.og || badges.premium) && (
            <span className="inline-flex items-center gap-1">
              {badges.verified && (
                <span title="Verifiziert" className="inline-flex items-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#3ba7ff">
                    <path d="M12 2l2.4 2.1 3.1-.5 1 3 2.9 1.4-.6 3.1 1.9 2.5-1.9 2.5.6 3.1-2.9 1.4-1 3-3.1-.5L12 22l-2.4-2.1-3.1.5-1-3-2.9-1.4.6-3.1L1.3 12l1.9-2.5-.6-3.1L5.5 5l1-3 3.1.5z" />
                    <path d="M8.5 12l2.3 2.3L16 9" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
              {badges.og && (
                <span title="Early Adopter" className="inline-flex items-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#f59e0b">
                    <path d="M12 2l2.9 6.3L22 9l-5 5 1.3 7L12 17.8 5.7 21 7 14 2 9l7.1-.7z" />
                  </svg>
                </span>
              )}
              {badges.premium && (
                <span title="VIP / Premium" className="inline-flex items-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#ec4899">
                    <path d="M3 8l4 3 5-6 5 6 4-3-2 11H5z" />
                  </svg>
                </span>
              )}
            </span>
          )}
        </div>
        <p className="text-sm text-zinc-400">@{user.username}</p>

        {profile.bio && <p className="mt-3 text-sm text-zinc-300">{profile.bio}</p>}

        <div className="mt-6 space-y-2.5">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 rounded-lg border border-white/15 hover:border-white/40 hover:bg-white/5 transition font-medium"
              style={{ borderColor: `${profile.accentColor}55` }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="mt-6 text-xs text-zinc-500">{profile.views} Aufrufe</p>
      </div>

      <ViewTracker profileId={profile.id} isOwner={isOwner} />

      {profile.audioUrl && (
        <AudioPlayer src={profile.audioUrl} autoplay={!!profile.audioAutoplay} />
      )}

      {profile.customCss && (
        <style dangerouslySetInnerHTML={{ __html: profile.customCss }} />
      )}
    </main>
  );
}
