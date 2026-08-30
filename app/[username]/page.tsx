import { notFound } from "next/navigation";
import {
  getUserByUsername,
  getProfileByUserId,
  getLinksByProfileId,
  incrementProfileViews,
} from "@/lib/models";
import ParticleEffect from "@/components/ParticleEffect";
import AudioPlayer from "@/components/AudioPlayer";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = getUserByUsername(username);
  if (!user) notFound();

  const profile = getProfileByUserId(user.id);
  if (!profile) notFound();

  const links = getLinksByProfileId(profile.id);
  incrementProfileViews(profile.id);

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

        <h1 className="text-xl font-bold">{profile.displayName || user.username}</h1>
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

      {profile.audioUrl && (
        <AudioPlayer src={profile.audioUrl} autoplay={!!profile.audioAutoplay} />
      )}

      {profile.customCss && (
        <style dangerouslySetInnerHTML={{ __html: profile.customCss }} />
      )}
    </main>
  );
}
