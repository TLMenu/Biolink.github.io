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
  accentColor: "#f472b6",
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
            accentColor: data.profile.accentColor ?? "#f472b6",
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
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-base)", color: "var(--text-muted)" }}
      >
        Lädt...
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <header
        className="px-6 py-4 flex items-center justify-between sticky top-0 z-10"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "color-mix(in srgb, var(--bg-base) 90%, transparent)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div>
          <h1 style={{ fontFamily: "var(--font-voice)", fontWeight: 500, fontSize: "1.15rem" }}>
            Dein Profil
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Deine Seite:{" "}
            <a
              href={`/${username}`}
              target="_blank"
              className="hover:underline"
              style={{ color: "var(--text-secondary)" }}
            >
              /{username}
            </a>
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {saved && (
            <span className="text-sm" style={{ color: "var(--success)" }}>
              Gespeichert ✓
            </span>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="glow px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
            style={
              {
                background: profile.accentColor,
                color: "var(--bg-base)",
                "--glow-color": profile.accentColor,
              } as React.CSSProperties
            }
          >
            {saving ? "Speichert..." : "Speichern"}
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg text-sm transition"
            style={{ border: "1px solid var(--border-strong)", color: "var(--text-secondary)" }}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        {/* Editor column */}
        <div className="space-y-10">
          <section className="space-y-4">
            <SectionLabel>Profil</SectionLabel>
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

          <section className="space-y-4">
            <SectionLabel>Hintergrund & Farben</SectionLabel>
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
                <ColorField
                  value={profile.backgroundColor}
                  onChange={(v) => updateField("backgroundColor", v)}
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
            <Field label="Deine Farbe">
              <ColorField
                value={profile.accentColor}
                onChange={(v) => updateField("accentColor", v)}
                glow
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
                className="input min-h-24"
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
                placeholder=".profile-card { ... }"
                value={profile.customCss}
                onChange={(e) => updateField("customCss", e.target.value)}
              />
            </Field>
          </section>

          <section className="space-y-4">
            <SectionLabel>Musik</SectionLabel>
            <Field label="Audio-URL (mp3)">
              <input
                className="input"
                placeholder="https://.../song.mp3"
                value={profile.audioUrl}
                onChange={(e) => updateField("audioUrl", e.target.value)}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <input
                type="checkbox"
                checked={profile.audioAutoplay}
                onChange={(e) => updateField("audioAutoplay", e.target.checked)}
              />
              Automatisch abspielen
            </label>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <SectionLabel>Links</SectionLabel>
              <button
                onClick={addLink}
                className="text-sm px-3 py-1.5 rounded-lg transition"
                style={{ border: "1px solid var(--border-strong)", color: "var(--text-secondary)" }}
              >
                + Link hinzufügen
              </button>
            </div>
            <div className="space-y-3">
              {links.map((link, i) => (
                <div
                  key={i}
                  className="flex gap-2 items-center rounded-lg p-3"
                  style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
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
                    className="px-2 transition"
                    style={{ color: "var(--danger)" }}
                    aria-label="Entfernen"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {links.length === 0 && (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Noch keine Links hinzugefügt.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Live preview column */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p
            className="text-xs uppercase tracking-[0.15em] mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            Vorschau
          </p>
          <div
            className="rounded-2xl p-6 flex flex-col items-center text-center"
            style={{
              background:
                profile.backgroundType === "color" ? profile.backgroundColor : "var(--bg-surface)",
              border: "1px solid var(--border)",
              minHeight: "420px",
            }}
          >
            <div
              className="glow w-16 h-16 rounded-full mb-4 flex items-center justify-center overflow-hidden"
              style={
                {
                  background: "var(--bg-surface-2)",
                  "--glow-color": profile.accentColor,
                } as React.CSSProperties
              }
            >
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span style={{ color: "var(--text-muted)", fontSize: "1.5rem" }}>?</span>
              )}
            </div>
            <p style={{ fontFamily: "var(--font-voice)", fontWeight: 500, fontSize: "1.1rem" }}>
              {profile.displayName || username || "dein name"}
            </p>
            <p className="text-sm mt-1 mb-4" style={{ color: "var(--text-secondary)" }}>
              {profile.bio || "deine bio erscheint hier"}
            </p>
            <div className="flex flex-col gap-2 w-full">
              {(links.length > 0 ? links : [{ label: "dein link", url: "" }]).map((l, i) => (
                <div
                  key={i}
                  className="text-sm rounded-lg py-2 px-3"
                  style={{
                    border: `1px solid ${profile.accentColor}`,
                    color: profile.accentColor,
                  }}
                >
                  {l.label || "link"}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          background: var(--bg-surface-2);
          border: 1px solid var(--border);
          padding: 0.55rem 0.75rem;
          outline: none;
          color: var(--text-primary);
          font-size: 0.9rem;
          transition: border-color 0.15s ease;
        }
        .input:focus {
          border-color: var(--border-strong);
        }
        .input::placeholder {
          color: var(--text-muted);
        }
      `}</style>
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-xs font-semibold uppercase tracking-wider"
      style={{ color: "var(--text-muted)" }}
    >
      {children}
    </h2>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm block mb-1.5" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function ColorField({
  value,
  onChange,
  glow,
}: {
  value: string;
  onChange: (v: string) => void;
  glow?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={glow ? "glow rounded-lg" : "rounded-lg"}
        style={{ ...(glow ? ({ "--glow-color": value } as React.CSSProperties) : {}) }}
      >
        <input
          type="color"
          className="h-10 w-16 rounded-lg cursor-pointer"
          style={{ background: "transparent", border: "1px solid var(--border)" }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <span className="text-sm" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
        {value}
      </span>
    </div>
  );
}
