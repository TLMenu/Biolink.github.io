"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type LinkItem = { label: string; url: string; icon?: string };

type ProfileData = {
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
};

const emptyProfile: ProfileData = {
  displayName: "",
  bio: "",
  avatarUrl: "",
  backgroundUrl: "",
  backgroundType: "color",
  backgroundColor: "#0f0f0f",
  accentColor: "#7c3aed",
  audioUrl: "",
  audioAutoplay: false,
  cursorEffect: "none",
  customCss: "",
};

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) {
          router.push("/login");
          return;
        }
        setUsername(data.user.username);
        if (data.profile) {
          setProfile({
            displayName: data.profile.displayName ?? "",
            bio: data.profile.bio ?? "",
            avatarUrl: data.profile.avatarUrl ?? "",
            backgroundUrl: data.profile.backgroundUrl ?? "",
            backgroundType: data.profile.backgroundType ?? "color",
            backgroundColor: data.profile.backgroundColor ?? "#0f0f0f",
            accentColor: data.profile.accentColor ?? "#7c3aed",
            audioUrl: data.profile.audioUrl ?? "",
            audioAutoplay: !!data.profile.audioAutoplay,
            cursorEffect: data.profile.cursorEffect ?? "none",
            customCss: data.profile.customCss ?? "",
          });
        }
        setLinks(
          (data.links ?? []).map((l: LinkItem) => ({
            label: l.label,
            url: l.url,
            icon: l.icon ?? "",
          }))
        );
        setLoading(false);
      });
  }, [router]);

  function updateField<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
    setSaved(false);
  }

  function updateLink(index: number, key: keyof LinkItem, value: string) {
    setLinks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
    setSaved(false);
  }

  function addLink() {
    setLinks((prev) => [...prev, { label: "", url: "", icon: "" }]);
  }

  function removeLink(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...profile, links }),
    });
    setSaving(false);
    setSaved(true);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-zinc-400">
        Lädt...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0f]/90 backdrop-blur z-10">
        <div>
          <h1 className="font-bold text-lg">Dashboard</h1>
          <p className="text-sm text-zinc-500">
            Deine Seite:{" "}
            <a
              href={`/${username}`}
              target="_blank"
              className="text-violet-400 hover:underline"
            >
              /{username}
            </a>
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {saved && <span className="text-sm text-green-400">Gespeichert ✓</span>}
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 transition text-sm font-medium disabled:opacity-50"
          >
            {saving ? "Speichert..." : "Speichern"}
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 transition text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-10">
        {/* Profil */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
            Profil
          </h2>
          <Field label="Anzeigename">
            <input
              className="input"
              value={profile.displayName}
              onChange={(e) => updateField("displayName", e.target.value)}
            />
          </Field>
          <Field label="Bio">
            <textarea
              className="input min-h-20"
              value={profile.bio}
              onChange={(e) => updateField("bio", e.target.value)}
            />
          </Field>
          <Field label="Avatar-URL">
            <input
              className="input"
              placeholder="https://..."
              value={profile.avatarUrl}
              onChange={(e) => updateField("avatarUrl", e.target.value)}
            />
          </Field>
        </section>

        {/* Design */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
            Hintergrund & Farben
          </h2>
          <Field label="Hintergrund-Typ">
            <select
              className="input"
              value={profile.backgroundType}
              onChange={(e) => updateField("backgroundType", e.target.value)}
            >
              <option value="color">Farbe</option>
              <option value="image">Bild</option>
              <option value="video">Video</option>
              <option value="gif">GIF</option>
            </select>
          </Field>
          {profile.backgroundType === "color" ? (
            <Field label="Hintergrundfarbe">
              <input
                type="color"
                className="h-10 w-20 rounded bg-transparent"
                value={profile.backgroundColor}
                onChange={(e) => updateField("backgroundColor", e.target.value)}
              />
            </Field>
          ) : (
            <Field label="Hintergrund-URL">
              <input
                className="input"
                placeholder="https://..."
                value={profile.backgroundUrl}
                onChange={(e) => updateField("backgroundUrl", e.target.value)}
              />
            </Field>
          )}
          <Field label="Akzentfarbe">
            <input
              type="color"
              className="h-10 w-20 rounded bg-transparent"
              value={profile.accentColor}
              onChange={(e) => updateField("accentColor", e.target.value)}
            />
          </Field>
          <Field label="Cursor / Partikel-Effekt">
            <select
              className="input"
              value={profile.cursorEffect}
              onChange={(e) => updateField("cursorEffect", e.target.value)}
            >
              <option value="none">Kein Effekt</option>
              <option value="snow">Schnee</option>
              <option value="stars">Sterne</option>
              <option value="sparkles">Funken</option>
            </select>
          </Field>
          <Field label="Custom CSS (Profis)">
            <textarea
              className="input min-h-24 font-mono text-xs"
              placeholder=".profile-card { ... }"
              value={profile.customCss}
              onChange={(e) => updateField("customCss", e.target.value)}
            />
          </Field>
        </section>

        {/* Audio */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
            Musik
          </h2>
          <Field label="Audio-URL (mp3)">
            <input
              className="input"
              placeholder="https://.../song.mp3"
              value={profile.audioUrl}
              onChange={(e) => updateField("audioUrl", e.target.value)}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-zinc-400">
            <input
              type="checkbox"
              checked={profile.audioAutoplay}
              onChange={(e) => updateField("audioAutoplay", e.target.checked)}
            />
            Automatisch abspielen
          </label>
        </section>

        {/* Links */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
              Links
            </h2>
            <button
              onClick={addLink}
              className="text-sm px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500"
            >
              + Link hinzufügen
            </button>
          </div>
          <div className="space-y-3">
            {links.map((link, i) => (
              <div
                key={i}
                className="flex gap-2 items-center bg-zinc-900/50 border border-zinc-800 rounded-lg p-3"
              >
                <input
                  className="input flex-1"
                  placeholder="Label (z.B. Discord)"
                  value={link.label}
                  onChange={(e) => updateLink(i, "label", e.target.value)}
                />
                <input
                  className="input flex-[2]"
                  placeholder="https://..."
                  value={link.url}
                  onChange={(e) => updateLink(i, "url", e.target.value)}
                />
                <button
                  onClick={() => removeLink(i)}
                  className="text-red-400 hover:text-red-300 px-2"
                  aria-label="Entfernen"
                >
                  ✕
                </button>
              </div>
            ))}
            {links.length === 0 && (
              <p className="text-sm text-zinc-500">Noch keine Links hinzugefügt.</p>
            )}
          </div>
        </section>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          background: rgb(39 39 42 / 0.7);
          border: 1px solid rgb(63 63 70);
          padding: 0.55rem 0.75rem;
          outline: none;
          color: white;
        }
        .input:focus {
          border-color: #7c3aed;
        }
      `}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm text-zinc-400 block mb-1">{label}</label>
      {children}
    </div>
  );
}
