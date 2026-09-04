"use client";

import { useEffect, useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./dashboard.css";

/* ---------------- icon set ---------------- */
const ICONS: Record<string, { label: string; color: string; svg: React.ReactNode }> = {
  discord: {
    label: "Discord",
    color: "#5865F2",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm6 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM7.5 5.5S9 4 12 4s4.5 1.5 4.5 1.5L18 6c1.5 2 1.5 8 1.5 8s-1.5 2-4 2l-.6-1.3c-.9.2-1.9.3-2.9.3s-2-.1-2.9-.3L8.5 16c-2.5 0-4-2-4-2s0-6 1.5-8z" />
      </svg>
    ),
  },
  instagram: {
    label: "Instagram",
    color: "#E1306C",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" />
      </svg>
    ),
  },
  x: {
    label: "X",
    color: "#e7e9ea",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  tiktok: {
    label: "TikTok",
    color: "#69C9D0",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 4v9.5a3.5 3.5 0 1 1-3-3.46" />
        <path d="M14 4c.5 2.5 2 4 4.5 4.3" />
      </svg>
    ),
  },
  youtube: {
    label: "YouTube",
    color: "#FF0000",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="6" width="18" height="12" rx="3" />
        <path d="M11 10l4 2-4 2z" fill="currentColor" />
      </svg>
    ),
  },
  twitch: {
    label: "Twitch",
    color: "#9146FF",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 4h15v9l-4 4h-4l-2 2H8v-2H5V4z" />
        <path d="M13 8v4M17 8v4" strokeLinecap="round" />
      </svg>
    ),
  },
  spotify: {
    label: "Spotify",
    color: "#1DB954",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M7.5 10.2c3-1 6.5-.6 9 1M8 13.3c2.5-.8 5.3-.5 7.3.8M8.5 16c2-.6 4.2-.3 5.8.7" />
      </svg>
    ),
  },
  github: {
    label: "GitHub",
    color: "#c9c9c9",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.1-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5A3.9 3.9 0 0 1 6.5 8c-.1-.2-.5-1.3.1-2.7 0 0 .9-.3 3 1.1a10.3 10.3 0 0 1 5.4 0c2.1-1.4 3-1.1 3-1.1.6 1.4.2 2.5.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7 1 .7 2v3c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
      </svg>
    ),
  },
  telegram: {
    label: "Telegram",
    color: "#29A9EA",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M21 4L3 11.5l6 2 2 6 3-4 5 3z" />
        <path d="M9 13.5L18 6" />
      </svg>
    ),
  },
  website: {
    label: "Website",
    color: "#b0b0c0",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
    ),
  },
};

const FONT_PAIRS: Record<string, { d: string; m: string }> = {
  "grotesk-mono": { d: "'Space Grotesk', sans-serif", m: "'JetBrains Mono', monospace" },
  "sora-plex": { d: "'Sora', sans-serif", m: "'IBM Plex Mono', monospace" },
  "poppins-fira": { d: "'Poppins', sans-serif", m: "'Fira Code', monospace" },
  "playfair-inter": { d: "'Playfair Display', serif", m: "'Inter', sans-serif" },
};

type LinkItem = {
  id: number | string;
  platform: string;
  label: string;
  url: string;
  labelTouched?: boolean;
};

type ProfileState = {
  avatar: string;
  avatarShape: "circle" | "rounded" | "square";
  avatarGlow: boolean;
  name: string;
  handle: string;
  bio: string;
  badges: { verified: boolean; og: boolean; premium: boolean };
  visibility: string;
  accent1: string;
  accent2: string;
  fontPair: string;
  cardStyle: "glass" | "solid" | "outline";
  radius: number;
  typewriter: boolean;
  bgType: "color" | "gradient" | "image" | "video";
  bgColor: string;
  bgGrad1: string;
  bgGrad2: string;
  bgAngle: number;
  bgAnimate: boolean;
  bgImage: string;
  bgVideo: string;
  overlay: number;
  particles: "none" | "snow" | "stars" | "sparks";
  particleDensity: number;
  cursorTrail: boolean;
  audioUrl: string;
  audioShow: boolean;
  audioAutoplay: boolean;
  audioVolume: number;
  links: LinkItem[];
  discordShow: boolean;
  discordStatus: string;
  discordActivity: string;
  viewCounter: boolean;
  viewCount: number;
  customCss: string;
};

const defaultProfileState: ProfileState = {
  avatar: "",
  avatarShape: "circle",
  avatarGlow: true,
  name: "deinname",
  handle: "deinname",
  bio: "✦ dein vibe, deine regeln ✦",
  badges: { verified: false, og: false, premium: false },
  visibility: "public",
  accent1: "#a855f7",
  accent2: "#ec4899",
  fontPair: "grotesk-mono",
  cardStyle: "glass",
  radius: 22,
  typewriter: false,
  bgType: "gradient",
  bgColor: "#0a0a0f",
  bgGrad1: "#1c1030",
  bgGrad2: "#0a0a0f",
  bgAngle: 135,
  bgAnimate: false,
  bgImage: "",
  bgVideo: "",
  overlay: 50,
  particles: "none",
  particleDensity: 40,
  cursorTrail: false,
  audioUrl: "",
  audioShow: true,
  audioAutoplay: false,
  audioVolume: 70,
  links: [
    { id: 1, platform: "discord", label: "Discord", url: "https://discord.gg/" },
    { id: 2, platform: "instagram", label: "Instagram", url: "https://instagram.com/" },
  ],
  discordShow: false,
  discordStatus: "Online",
  discordActivity: "Spielt Visual Studio Code",
  viewCounter: true,
  viewCount: 1204,
  customCss: "",
};

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("profil");
  const [state, setState] = useState<ProfileState>(defaultProfileState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [typedBio, setTypedBio] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToastMsg(null), 2600);
  };

  // 1. Load initial user & profile from API with strict no-cache check
  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!data?.user) {
          localStorage.removeItem("biolink_profile_config_v1");
          window.location.replace("/login");
          return;
        }

        const username = data.user.username;
        const p = data.profile || {};
        const remoteLinks: LinkItem[] = (data.links || []).map((l: { label: string; url: string; icon?: string }, i: number) => ({
          id: i + 1,
          platform: l.icon && ICONS[l.icon] ? l.icon : "website",
          label: l.label,
          url: l.url,
        }));

        // Check local storage for enhanced styling options
        let localConfig: Partial<ProfileState> = {};
        try {
          const raw = localStorage.getItem("biolink_profile_config_v1");
          if (raw) localConfig = JSON.parse(raw);
        } catch {
          // ignore
        }

        setState((prev) => {
          return {
            ...prev,
            ...localConfig,
            name: p.displayName || prev.name || username,
            handle: username,
            bio: p.bio !== null && p.bio !== undefined ? p.bio : prev.bio,
            avatar: p.avatarUrl || prev.avatar,
            bgType: (p.backgroundType as ProfileState["bgType"]) || prev.bgType,
            bgColor: p.backgroundColor || prev.bgColor,
            bgImage: p.backgroundType === "image" ? p.backgroundUrl || "" : prev.bgImage,
            bgVideo: p.backgroundType === "video" ? p.backgroundUrl || "" : prev.bgVideo,
            accent1: p.accentColor || prev.accent1,
            audioUrl: p.audioUrl || prev.audioUrl,
            audioAutoplay: !!p.audioAutoplay,
            particles: (p.cursorEffect as ProfileState["particles"]) || prev.particles,
            customCss: p.customCss || prev.customCss,
            viewCount: p.views || prev.viewCount,
            links: remoteLinks.length > 0 ? remoteLinks : prev.links,
          };
        });

        setLoading(false);
      })
      .catch(() => {
        window.location.replace("/login");
      });
  }, [router]);

  // Anti-Back-Button / bfcache protection
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        fetch("/api/me", { cache: "no-store" })
          .then((r) => r.json())
          .then((data) => {
            if (!data?.user) {
              localStorage.removeItem("biolink_profile_config_v1");
              window.location.replace("/login");
            }
          })
          .catch(() => {
            window.location.replace("/login");
          });
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // Helper updater
  const updateField = <K extends keyof ProfileState>(key: K, val: ProfileState[K]) => {
    setState((prev) => ({ ...prev, [key]: val }));
    setSaved(false);
  };

  // Helper for nested badge
  const updateBadge = (key: keyof ProfileState["badges"], val: boolean) => {
    setState((prev) => ({
      ...prev,
      badges: { ...prev.badges, [key]: val },
    }));
    setSaved(false);
  };

  // 2. Typewriter Effect
  useEffect(() => {
    if (!state.typewriter) {
      setTypedBio(state.bio);
      return;
    }
    let i = 0;
    const text = state.bio || "";
    setTypedBio("");
    const interval = setInterval(() => {
      if (i <= text.length) {
        setTypedBio(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, [state.bio, state.typewriter]);

  // 3. Canvas particle engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();

    if (state.particles === "none") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const count = Math.round(state.particleDensity * 0.6);
    type Particle = {
      x: number;
      y: number;
      r: number;
      sp: number;
      drift: number;
      tw?: number;
      life?: number;
    };

    const makeParticle = (cv: HTMLCanvasElement, initial: boolean): Particle => {
      const type = state.particles;
      if (type === "snow") {
        return {
          x: Math.random() * cv.width,
          y: initial ? Math.random() * cv.height : -6,
          r: 1 + Math.random() * 2.2,
          sp: 0.4 + Math.random() * 0.8,
          drift: (Math.random() - 0.5) * 0.4,
        };
      } else if (type === "stars") {
        return {
          x: Math.random() * cv.width,
          y: Math.random() * cv.height,
          r: 0.6 + Math.random() * 1.4,
          sp: 0,
          drift: 0,
          tw: Math.random() * Math.PI * 2,
        };
      } else {
        return {
          x: Math.random() * cv.width,
          y: cv.height + Math.random() * 20,
          r: 1 + Math.random() * 1.8,
          sp: 0.6 + Math.random() * 1.3,
          drift: (Math.random() - 0.5) * 0.6,
          life: Math.random(),
        };
      }
    };

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push(makeParticle(canvas, true));
    }

    const hexToRgba = (hex: string, a: number) => {
      const h = hex.replace("#", "");
      const r = parseInt(h.substring(0, 2), 16) || 200;
      const g = parseInt(h.substring(2, 4), 16) || 100;
      const b = parseInt(h.substring(4, 6), 16) || 250;
      return `rgba(${r},${g},${b},${a})`;
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const type = state.particles;

      particles.forEach((p, idx) => {
        if (type === "snow") {
          ctx.beginPath();
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          p.y += p.sp;
          p.x += p.drift;
          if (p.y > canvas.height + 6) {
            particles[idx] = makeParticle(canvas, false);
          }
        } else if (type === "stars") {
          p.tw = (p.tw || 0) + 0.03;
          const op = 0.35 + Math.abs(Math.sin(p.tw)) * 0.65;
          ctx.beginPath();
          ctx.fillStyle = `rgba(255,255,255,${op.toFixed(2)})`;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          p.life = (p.life || 0) + 0.006;
          const op = Math.max(0, 1 - p.life);
          ctx.beginPath();
          ctx.fillStyle = hexToRgba(state.accent2, op);
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          p.y -= p.sp;
          p.x += p.drift;
          if (p.life >= 1) {
            particles[idx] = makeParticle(canvas, false);
          }
        }
      });
      animId = requestAnimationFrame(tick);
    };

    tick();
    return () => cancelAnimationFrame(animId);
  }, [state.particles, state.particleDensity, state.accent2]);

  // 4. Cursor trail on card
  useEffect(() => {
    if (!state.cursorTrail) return;
    const card = cardRef.current;
    if (!card) return;

    let last = 0;
    const onMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - last < 40) return;
      last = now;
      const rect = card.getBoundingClientRect();
      const dot = document.createElement("div");
      dot.style.cssText =
        "position:absolute;z-index:4;pointer-events:none;width:7px;height:7px;border-radius:50%;" +
        `left:${e.clientX - rect.left}px;top:${e.clientY - rect.top}px;` +
        `background:${state.accent1};box-shadow:0 0 10px ${state.accent1};transition:opacity 0.6s ease, transform 0.6s ease;opacity:0.8;`;
      card.appendChild(dot);
      requestAnimationFrame(() => {
        dot.style.opacity = "0";
        dot.style.transform = "scale(0.3)";
      });
      setTimeout(() => dot.remove(), 650);
    };

    card.addEventListener("mousemove", onMouseMove);
    return () => card.removeEventListener("mousemove", onMouseMove);
  }, [state.cursorTrail, state.accent1]);

  // Save to database & localStorage
  const handleSave = async () => {
    setSaving(true);

    const payload = {
      displayName: state.name,
      bio: state.bio,
      avatarUrl: state.avatar,
      backgroundType: state.bgType,
      backgroundColor: state.bgType === "gradient" ? state.bgGrad1 : state.bgColor,
      backgroundUrl:
        state.bgType === "image"
          ? state.bgImage
          : state.bgType === "video"
          ? state.bgVideo
          : "",
      accentColor: state.accent1,
      audioUrl: state.audioUrl,
      audioAutoplay: state.audioAutoplay,
      cursorEffect: state.particles,
      customCss: state.customCss,
      links: state.links.map((l) => ({
        label: l.label,
        url: l.url,
        icon: l.platform,
      })),
    };

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        localStorage.setItem("biolink_profile_config_v1", JSON.stringify(state));
        setSaved(true);
        showToast("Gespeichert ✓");
      } else {
        showToast("Fehler beim Speichern");
      }
    } catch {
      showToast("Netzwerkfehler");
    } finally {
      setSaving(false);
    }
  };

  // Copy handle
  const handleCopy = () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/${state.handle}` : `https://mybiolinkpage.de/${state.handle}`;
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => showToast("Link kopiert"))
        .catch(() => showToast(url));
    } else {
      showToast(url);
    }
  };

  // Export JSON
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.handle || "profile"}-biolink.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("JSON exportiert");
  };

  // Import JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        setState((prev) => ({ ...prev, ...parsed }));
        setSaved(false);
        showToast("Konfiguration importiert");
      } catch {
        showToast("Ungültige JSON-Datei");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Reset
  const handleReset = () => {
    if (!confirm("Wirklich alle Änderungen zurücksetzen?")) return;
    setState(defaultProfileState);
    setSaved(false);
    showToast("Zurückgesetzt");
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    localStorage.removeItem("biolink_profile_config_v1");
    sessionStorage.clear();
    window.location.replace("/login");
  };

  // Link actions
  const addLink = () => {
    const newId = Date.now();
    setState((prev) => ({
      ...prev,
      links: [...prev.links, { id: newId, platform: "website", label: "Website", url: "" }],
    }));
    setSaved(false);
  };

  const removeLink = (id: number | string) => {
    setState((prev) => ({
      ...prev,
      links: prev.links.filter((l) => l.id !== id),
    }));
    setSaved(false);
  };

  const moveLink = (idx: number, dir: -1 | 1) => {
    setState((prev) => {
      const next = [...prev.links];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return { ...prev, links: next };
    });
    setSaved(false);
  };

  const updateLink = (id: number | string, key: keyof LinkItem, val: string) => {
    setState((prev) => ({
      ...prev,
      links: prev.links.map((l) => {
        if (l.id !== id) return l;
        if (key === "platform") {
          return {
            ...l,
            platform: val,
            label: l.labelTouched ? l.label : (ICONS[val]?.label || val),
          };
        }
        if (key === "label") {
          return { ...l, label: val, labelTouched: true };
        }
        return { ...l, [key]: val };
      }),
    }));
    setSaved(false);
  };

  const activeFont = FONT_PAIRS[state.fontPair] || FONT_PAIRS["grotesk-mono"];

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-zinc-400">
        Lädt Dashboard...
      </main>
    );
  }

  return (
    <div className="dash-app">
      {/* ================= topbar ================= */}
      <header className="dash-topbar">
        <Link href="/" className="dash-brand">
          <img src="/BioLink-Icon.png" alt="biolink icon" />
          <span>biolink</span>
        </Link>

        <div className="dash-handle-pill">
          <span>mybiolinkpage.de/{state.handle}</span>
          <button type="button" onClick={handleCopy} title="Link kopieren">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="12" height="12" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        </div>

        <div className="dash-topbar-actions">
          <span className="dash-save-status">
            <span
              className="dot"
              style={{ background: saved ? "var(--dash-success)" : "var(--dash-accent-1)" }}
            />
            <span>{saving ? "Speichern…" : saved ? "Gespeichert" : "Ungespeichert"}</span>
          </span>

          <button
            type="button"
            className="d-btn d-btn-quiet d-btn-sm"
            onClick={() => importInputRef.current?.click()}
          >
            Importieren
          </button>
          <input
            type="file"
            ref={importInputRef}
            onChange={handleImport}
            accept="application/json"
            style={{ display: "none" }}
          />

          <button type="button" className="d-btn d-btn-ghost d-btn-sm" onClick={handleExport}>
            Exportieren
          </button>

          <button type="button" className="d-btn d-btn-danger d-btn-sm" onClick={handleReset}>
            Zurücksetzen
          </button>

          <button
            type="button"
            className="d-btn d-btn-primary d-btn-sm"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Speichern..." : "Speichern"}
          </button>

          <button type="button" className="d-btn d-btn-quiet d-btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* ================= editor body ================= */}
      <div className="dash-editor-body">
        <div className="dash-panel">
          {/* Tab Navigation */}
          <nav className="dash-tabs">
            <button
              type="button"
              className={`dash-tab-btn ${activeTab === "profil" ? "active" : ""}`}
              onClick={() => setActiveTab("profil")}
            >
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
              </svg>
              Profil
            </button>

            <button
              type="button"
              className={`dash-tab-btn ${activeTab === "design" ? "active" : ""}`}
              onClick={() => setActiveTab("design")}
            >
              <svg viewBox="0 0 24 24">
                <circle cx="13.5" cy="6.5" r="0.5" />
                <circle cx="17.5" cy="10.5" r="0.5" />
                <circle cx="8.5" cy="7.5" r="0.5" />
                <circle cx="6.5" cy="12.5" r="0.5" />
                <path d="M12 2a10 10 0 1 0 0 20c1.5 0 2-1 2-2a2 2 0 0 1 2-2h.5A3.5 3.5 0 0 0 20 14.5C20 8 17 2 12 2z" />
              </svg>
              Design
            </button>

            <button
              type="button"
              className={`dash-tab-btn ${activeTab === "hintergrund" ? "active" : ""}`}
              onClick={() => setActiveTab("hintergrund")}
            >
              <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 15l5-5 4 4 3-3 6 6" />
              </svg>
              Hintergrund
            </button>

            <button
              type="button"
              className={`dash-tab-btn ${activeTab === "effekte" ? "active" : ""}`}
              onClick={() => setActiveTab("effekte")}
            >
              <svg viewBox="0 0 24 24">
                <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
              </svg>
              Effekte
            </button>

            <button
              type="button"
              className={`dash-tab-btn ${activeTab === "audio" ? "active" : ""}`}
              onClick={() => setActiveTab("audio")}
            >
              <svg viewBox="0 0 24 24">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              Audio
            </button>

            <button
              type="button"
              className={`dash-tab-btn ${activeTab === "links" ? "active" : ""}`}
              onClick={() => setActiveTab("links")}
            >
              <svg viewBox="0 0 24 24">
                <path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1 1" />
                <path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1-1" />
              </svg>
              Links
            </button>

            <button
              type="button"
              className={`dash-tab-btn ${activeTab === "erweitert" ? "active" : ""}`}
              onClick={() => setActiveTab("erweitert")}
            >
              <svg viewBox="0 0 24 24">
                <path d="M4 7h16M4 12h10M4 17h13" />
              </svg>
              Mehr
            </button>
          </nav>

          {/* Tab Content Panes */}
          <div className="dash-tab-content">
            {/* PROFIL TAB */}
            {activeTab === "profil" && (
              <section>
                <h2 className="dash-pane-title">Profil</h2>
                <p className="dash-pane-sub">Wer du bist und wie man dich findet.</p>

                <div className="dash-field">
                  <label htmlFor="f-avatar">Avatar-URL</label>
                  <input
                    type="url"
                    id="f-avatar"
                    className="dash-input"
                    placeholder="https://…/dein-bild.png"
                    value={state.avatar}
                    onChange={(e) => updateField("avatar", e.target.value)}
                  />
                </div>

                <div className="dash-field-row">
                  <div className="dash-field">
                    <label>Avatar-Form</label>
                    <div className="dash-segmented">
                      <button
                        type="button"
                        className={state.avatarShape === "circle" ? "active" : ""}
                        onClick={() => updateField("avatarShape", "circle")}
                      >
                        Rund
                      </button>
                      <button
                        type="button"
                        className={state.avatarShape === "rounded" ? "active" : ""}
                        onClick={() => updateField("avatarShape", "rounded")}
                      >
                        Weich
                      </button>
                      <button
                        type="button"
                        className={state.avatarShape === "square" ? "active" : ""}
                        onClick={() => updateField("avatarShape", "square")}
                      >
                        Eckig
                      </button>
                    </div>
                  </div>
                </div>

                <div className="dash-toggle-row">
                  <div>
                    <div className="dash-toggle-label">Avatar-Leuchten</div>
                    <div className="dash-toggle-desc">Sanftes Glühen im Akzentfarbton</div>
                  </div>
                  <label className="dash-switch">
                    <input
                      type="checkbox"
                      checked={state.avatarGlow}
                      onChange={(e) => updateField("avatarGlow", e.target.checked)}
                    />
                    <span className="track" />
                  </label>
                </div>

                <hr className="dash-sep" />

                <div className="dash-field">
                  <label htmlFor="f-name">Anzeigename</label>
                  <input
                    type="text"
                    id="f-name"
                    className="dash-input"
                    placeholder="dein name"
                    maxLength={28}
                    value={state.name}
                    onChange={(e) => updateField("name", e.target.value)}
                  />
                </div>

                <div className="dash-field">
                  <label htmlFor="f-handle">Benutzername</label>
                  <div className="dash-handle-input">
                    <span className="prefix">mybiolinkpage.de/</span>
                    <input
                      type="text"
                      id="f-handle"
                      className="dash-input"
                      placeholder="deinname"
                      maxLength={20}
                      value={state.handle}
                      onChange={(e) =>
                        updateField("handle", e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ""))
                      }
                    />
                  </div>
                </div>

                <div className="dash-field">
                  <label htmlFor="f-bio">Bio</label>
                  <textarea
                    id="f-bio"
                    className="dash-textarea"
                    maxLength={140}
                    placeholder="✦ dein vibe, deine regeln ✦"
                    value={state.bio}
                    onChange={(e) => updateField("bio", e.target.value)}
                  />
                  <div className="hint">{state.bio.length}/140</div>
                </div>

                <hr className="dash-sep" />

                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--dash-text-dim)", marginBottom: 8 }}>
                  Badges
                </label>

                <label className="dash-badge-check">
                  <input
                    type="checkbox"
                    checked={state.badges.verified}
                    onChange={(e) => updateBadge("verified", e.target.checked)}
                  />
                  <span className="swatch-icon">
                    <svg viewBox="0 0 24 24" fill="#3ba7ff" width={20} height={20}>
                      <path d="M12 2l2.4 2.1 3.1-.5 1 3 2.9 1.4-.6 3.1 1.9 2.5-1.9 2.5.6 3.1-2.9 1.4-1 3-3.1-.5L12 22l-2.4-2.1-3.1.5-1-3-2.9-1.4.6-3.1L1.3 12l1.9-2.5-.6-3.1L5.5 5l1-3 3.1.5z" />
                      <path d="M8.5 12l2.3 2.3L16 9" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="lbl">Verifiziert</span>
                </label>

                <label className="dash-badge-check">
                  <input
                    type="checkbox"
                    checked={state.badges.og}
                    onChange={(e) => updateBadge("og", e.target.checked)}
                  />
                  <span className="swatch-icon">
                    <svg viewBox="0 0 24 24" fill="#f59e0b" width={20} height={20}>
                      <path d="M12 2l2.9 6.3L22 9l-5 5 1.3 7L12 17.8 5.7 21 7 14 2 9l7.1-.7z" />
                    </svg>
                  </span>
                  <span className="lbl">OG</span>
                </label>

                <label className="dash-badge-check">
                  <input
                    type="checkbox"
                    checked={state.badges.premium}
                    onChange={(e) => updateBadge("premium", e.target.checked)}
                  />
                  <span className="swatch-icon">
                    <svg viewBox="0 0 24 24" fill="#ec4899" width={20} height={20}>
                      <path d="M3 8l4 3 5-6 5 6 4-3-2 11H5z" />
                    </svg>
                  </span>
                  <span className="lbl">Premium</span>
                </label>

                <hr className="dash-sep" />

                <div className="dash-field">
                  <label htmlFor="f-visibility">Sichtbarkeit</label>
                  <select
                    id="f-visibility"
                    className="dash-select"
                    value={state.visibility}
                    onChange={(e) => updateField("visibility", e.target.value)}
                  >
                    <option value="public">Öffentlich — für alle sichtbar</option>
                    <option value="unlisted">Nicht gelistet — nur per Link</option>
                  </select>
                </div>
              </section>
            )}

            {/* DESIGN TAB */}
            {activeTab === "design" && (
              <section>
                <h2 className="dash-pane-title">Design</h2>
                <p className="dash-pane-sub">Farben, Schrift und Form deiner Seite.</p>

                <div className="dash-field-row">
                  <div className="dash-field">
                    <label>Akzentfarbe 1</label>
                    <div className="dash-color-field">
                      <div className="dash-color-swatch" style={{ background: state.accent1 }}>
                        <input
                          type="color"
                          value={state.accent1}
                          onChange={(e) => updateField("accent1", e.target.value)}
                        />
                      </div>
                      <input
                        type="text"
                        className="dash-input"
                        value={state.accent1.toUpperCase()}
                        onChange={(e) => updateField("accent1", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="dash-field">
                    <label>Akzentfarbe 2</label>
                    <div className="dash-color-field">
                      <div className="dash-color-swatch" style={{ background: state.accent2 }}>
                        <input
                          type="color"
                          value={state.accent2}
                          onChange={(e) => updateField("accent2", e.target.value)}
                        />
                      </div>
                      <input
                        type="text"
                        className="dash-input"
                        value={state.accent2.toUpperCase()}
                        onChange={(e) => updateField("accent2", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="dash-field">
                  <label htmlFor="f-fontpair">Schriftpaar</label>
                  <select
                    id="f-fontpair"
                    className="dash-select"
                    value={state.fontPair}
                    onChange={(e) => updateField("fontPair", e.target.value)}
                  >
                    <option value="grotesk-mono">Space Grotesk / JetBrains Mono</option>
                    <option value="sora-plex">Sora / IBM Plex Mono</option>
                    <option value="poppins-fira">Poppins / Fira Code</option>
                    <option value="playfair-inter">Playfair Display / Inter</option>
                  </select>
                </div>

                <div className="dash-field">
                  <label>Karten-Stil</label>
                  <div className="dash-segmented">
                    <button
                      type="button"
                      className={state.cardStyle === "glass" ? "active" : ""}
                      onClick={() => updateField("cardStyle", "glass")}
                    >
                      Glas
                    </button>
                    <button
                      type="button"
                      className={state.cardStyle === "solid" ? "active" : ""}
                      onClick={() => updateField("cardStyle", "solid")}
                    >
                      Solide
                    </button>
                    <button
                      type="button"
                      className={state.cardStyle === "outline" ? "active" : ""}
                      onClick={() => updateField("cardStyle", "outline")}
                    >
                      Outline
                    </button>
                  </div>
                </div>

                <div className="dash-field">
                  <label htmlFor="f-radius">Eckenradius — {state.radius}px</label>
                  <input
                    type="range"
                    id="f-radius"
                    min="0"
                    max="40"
                    value={state.radius}
                    style={{ width: "100%", accentColor: "var(--dash-accent-1)" }}
                    onChange={(e) => updateField("radius", Number(e.target.value))}
                  />
                </div>

                <div className="dash-toggle-row">
                  <div>
                    <div className="dash-toggle-label">Schreibmaschinen-Bio</div>
                    <div className="dash-toggle-desc">Bio wird beim Laden getippt</div>
                  </div>
                  <label className="dash-switch">
                    <input
                      type="checkbox"
                      checked={state.typewriter}
                      onChange={(e) => updateField("typewriter", e.target.checked)}
                    />
                    <span className="track" />
                  </label>
                </div>
              </section>
            )}

            {/* HINTERGRUND TAB */}
            {activeTab === "hintergrund" && (
              <section>
                <h2 className="dash-pane-title">Hintergrund</h2>
                <p className="dash-pane-sub">Farbe, Verlauf, Bild oder Video.</p>

                <div className="dash-field">
                  <label>Typ</label>
                  <select
                    className="dash-select"
                    value={state.bgType}
                    onChange={(e) => updateField("bgType", e.target.value as ProfileState["bgType"])}
                  >
                    <option value="color">Farbe</option>
                    <option value="gradient">Verlauf</option>
                    <option value="image">Bild</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                {state.bgType === "color" && (
                  <div className="dash-field">
                    <label>Farbe</label>
                    <div className="dash-color-field">
                      <div className="dash-color-swatch" style={{ background: state.bgColor }}>
                        <input
                          type="color"
                          value={state.bgColor}
                          onChange={(e) => updateField("bgColor", e.target.value)}
                        />
                      </div>
                      <input
                        type="text"
                        className="dash-input"
                        value={state.bgColor.toUpperCase()}
                        onChange={(e) => updateField("bgColor", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {state.bgType === "gradient" && (
                  <>
                    <div className="dash-field-row">
                      <div className="dash-field">
                        <label>Farbe A</label>
                        <div className="dash-color-field">
                          <div className="dash-color-swatch" style={{ background: state.bgGrad1 }}>
                            <input
                              type="color"
                              value={state.bgGrad1}
                              onChange={(e) => updateField("bgGrad1", e.target.value)}
                            />
                          </div>
                          <input
                            type="text"
                            className="dash-input"
                            value={state.bgGrad1.toUpperCase()}
                            onChange={(e) => updateField("bgGrad1", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="dash-field">
                        <label>Farbe B</label>
                        <div className="dash-color-field">
                          <div className="dash-color-swatch" style={{ background: state.bgGrad2 }}>
                            <input
                              type="color"
                              value={state.bgGrad2}
                              onChange={(e) => updateField("bgGrad2", e.target.value)}
                            />
                          </div>
                          <input
                            type="text"
                            className="dash-input"
                            value={state.bgGrad2.toUpperCase()}
                            onChange={(e) => updateField("bgGrad2", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="dash-field">
                      <label htmlFor="f-bgangle">Winkel — {state.bgAngle}°</label>
                      <input
                        type="range"
                        id="f-bgangle"
                        min="0"
                        max="360"
                        value={state.bgAngle}
                        style={{ width: "100%", accentColor: "var(--dash-accent-1)" }}
                        onChange={(e) => updateField("bgAngle", Number(e.target.value))}
                      />
                    </div>

                    <div className="dash-toggle-row">
                      <div>
                        <div className="dash-toggle-label">Animierter Verlauf</div>
                        <div className="dash-toggle-desc">Farben verschieben sich sanft</div>
                      </div>
                      <label className="dash-switch">
                        <input
                          type="checkbox"
                          checked={state.bgAnimate}
                          onChange={(e) => updateField("bgAnimate", e.target.checked)}
                        />
                        <span className="track" />
                      </label>
                    </div>
                  </>
                )}

                {state.bgType === "image" && (
                  <div className="dash-field">
                    <label htmlFor="f-bgimage">Bild-URL</label>
                    <input
                      type="url"
                      id="f-bgimage"
                      className="dash-input"
                      placeholder="https://…/hintergrund.jpg"
                      value={state.bgImage}
                      onChange={(e) => updateField("bgImage", e.target.value)}
                    />
                  </div>
                )}

                {state.bgType === "video" && (
                  <div className="dash-field">
                    <label htmlFor="f-bgvideo">Video-URL (mp4)</label>
                    <input
                      type="url"
                      id="f-bgvideo"
                      className="dash-input"
                      placeholder="https://…/hintergrund.mp4"
                      value={state.bgVideo}
                      onChange={(e) => updateField("bgVideo", e.target.value)}
                    />
                  </div>
                )}

                <div className="dash-field">
                  <label htmlFor="f-overlay">Abdunkelung — {state.overlay}%</label>
                  <input
                    type="range"
                    id="f-overlay"
                    min="0"
                    max="90"
                    value={state.overlay}
                    style={{ width: "100%", accentColor: "var(--dash-accent-1)" }}
                    onChange={(e) => updateField("overlay", Number(e.target.value))}
                  />
                  <div className="hint">Macht Text über Bildern/Videos lesbar.</div>
                </div>
              </section>
            )}

            {/* EFFEKTE TAB */}
            {activeTab === "effekte" && (
              <section>
                <h2 className="dash-pane-title">Effekte</h2>
                <p className="dash-pane-sub">Bewegung, die deine Seite lebendig macht.</p>

                <div className="dash-field">
                  <label>Partikel</label>
                  <div className="dash-segmented">
                    <button
                      type="button"
                      className={state.particles === "none" ? "active" : ""}
                      onClick={() => updateField("particles", "none")}
                    >
                      Keine
                    </button>
                    <button
                      type="button"
                      className={state.particles === "snow" ? "active" : ""}
                      onClick={() => updateField("particles", "snow")}
                    >
                      Schnee
                    </button>
                    <button
                      type="button"
                      className={state.particles === "stars" ? "active" : ""}
                      onClick={() => updateField("particles", "stars")}
                    >
                      Sterne
                    </button>
                    <button
                      type="button"
                      className={state.particles === "sparks" ? "active" : ""}
                      onClick={() => updateField("particles", "sparks")}
                    >
                      Funken
                    </button>
                  </div>
                </div>

                <div className="dash-field">
                  <label htmlFor="f-particledensity">Dichte — {state.particleDensity}</label>
                  <input
                    type="range"
                    id="f-particledensity"
                    min="10"
                    max="100"
                    value={state.particleDensity}
                    style={{ width: "100%", accentColor: "var(--dash-accent-1)" }}
                    onChange={(e) => updateField("particleDensity", Number(e.target.value))}
                  />
                </div>

                <div className="dash-toggle-row">
                  <div>
                    <div className="dash-toggle-label">Cursor-Spur</div>
                    <div className="dash-toggle-desc">Leuchtspur folgt der Maus (nur Vorschau)</div>
                  </div>
                  <label className="dash-switch">
                    <input
                      type="checkbox"
                      checked={state.cursorTrail}
                      onChange={(e) => updateField("cursorTrail", e.target.checked)}
                    />
                    <span className="track" />
                  </label>
                </div>
              </section>
            )}

            {/* AUDIO TAB */}
            {activeTab === "audio" && (
              <section>
                <h2 className="dash-pane-title">Audio</h2>
                <p className="dash-pane-sub">Dein Sound, sobald jemand deine Seite öffnet.</p>

                <div className="dash-field">
                  <label htmlFor="f-audiourl">Track-URL (mp3)</label>
                  <input
                    type="url"
                    id="f-audiourl"
                    className="dash-input"
                    placeholder="https://…/track.mp3"
                    value={state.audioUrl}
                    onChange={(e) => updateField("audioUrl", e.target.value)}
                  />
                </div>

                <div className="dash-toggle-row">
                  <div>
                    <div className="dash-toggle-label">Player anzeigen</div>
                    <div className="dash-toggle-desc">Kleine Anzeige auf dem Profil</div>
                  </div>
                  <label className="dash-switch">
                    <input
                      type="checkbox"
                      checked={state.audioShow}
                      onChange={(e) => updateField("audioShow", e.target.checked)}
                    />
                    <span className="track" />
                  </label>
                </div>

                <div className="dash-toggle-row">
                  <div>
                    <div className="dash-toggle-label">Autoplay</div>
                    <div className="dash-toggle-desc">Startet automatisch beim Öffnen</div>
                  </div>
                  <label className="dash-switch">
                    <input
                      type="checkbox"
                      checked={state.audioAutoplay}
                      onChange={(e) => updateField("audioAutoplay", e.target.checked)}
                    />
                    <span className="track" />
                  </label>
                </div>

                <div className="dash-field" style={{ marginTop: 20 }}>
                  <label htmlFor="f-audiovolume">Lautstärke — {state.audioVolume}%</label>
                  <input
                    type="range"
                    id="f-audiovolume"
                    min="0"
                    max="100"
                    value={state.audioVolume}
                    style={{ width: "100%", accentColor: "var(--dash-accent-1)" }}
                    onChange={(e) => updateField("audioVolume", Number(e.target.value))}
                  />
                </div>
              </section>
            )}

            {/* LINKS TAB */}
            {activeTab === "links" && (
              <section>
                <h2 className="dash-pane-title">Links</h2>
                <p className="dash-pane-sub">Alle deine Profile an einem Ort.</p>

                <div id="linksList">
                  {state.links.map((link, idx) => (
                    <div key={link.id} className="dash-link-row">
                      <div className="dash-link-row-top">
                        <select
                          className="dash-select"
                          value={link.platform}
                          onChange={(e) => updateLink(link.id, "platform", e.target.value)}
                        >
                          {Object.keys(ICONS).map((k) => (
                            <option key={k} value={k}>
                              {ICONS[k].label}
                            </option>
                          ))}
                        </select>
                        <span className="drag-hint">Link {idx + 1}</span>
                        <div className="dash-link-row-actions">
                          <button
                            type="button"
                            className="d-btn d-btn-quiet d-btn-icon"
                            onClick={() => moveLink(idx, -1)}
                            disabled={idx === 0}
                            title="Nach oben"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className="d-btn d-btn-quiet d-btn-icon"
                            onClick={() => moveLink(idx, 1)}
                            disabled={idx === state.links.length - 1}
                            title="Nach unten"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            className="d-btn d-btn-danger d-btn-icon"
                            onClick={() => removeLink(link.id)}
                            title="Entfernen"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      <div className="dash-field" style={{ marginBottom: 8 }}>
                        <label>Beschriftung</label>
                        <input
                          type="text"
                          className="dash-input"
                          maxLength={24}
                          value={link.label}
                          onChange={(e) => updateLink(link.id, "label", e.target.value)}
                        />
                      </div>

                      <div className="dash-field" style={{ marginBottom: 0 }}>
                        <label>URL</label>
                        <input
                          type="url"
                          className="dash-input"
                          placeholder="https://…"
                          value={link.url}
                          onChange={(e) => updateLink(link.id, "url", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}

                  {state.links.length === 0 && (
                    <div className="dash-empty-links">Noch keine Links. Füge deinen ersten hinzu.</div>
                  )}
                </div>

                <button type="button" className="dash-add-link-btn" onClick={addLink}>
                  + Link hinzufügen
                </button>

                <hr className="dash-sep" />

                <div className="dash-toggle-row">
                  <div>
                    <div className="dash-toggle-label">Discord-Status anzeigen</div>
                    <div className="dash-toggle-desc">Zeigt deine aktuelle Aktivität</div>
                  </div>
                  <label className="dash-switch">
                    <input
                      type="checkbox"
                      checked={state.discordShow}
                      onChange={(e) => updateField("discordShow", e.target.checked)}
                    />
                    <span className="track" />
                  </label>
                </div>

                {state.discordShow && (
                  <div style={{ marginTop: 14 }}>
                    <div className="dash-field">
                      <label htmlFor="f-discordstatus">Status</label>
                      <input
                        type="text"
                        id="f-discordstatus"
                        className="dash-input"
                        placeholder="Online"
                        maxLength={30}
                        value={state.discordStatus}
                        onChange={(e) => updateField("discordStatus", e.target.value)}
                      />
                    </div>
                    <div className="dash-field">
                      <label htmlFor="f-discordactivity">Aktivität</label>
                      <input
                        type="text"
                        id="f-discordactivity"
                        className="dash-input"
                        placeholder="Spielt Visual Studio Code"
                        maxLength={40}
                        value={state.discordActivity}
                        onChange={(e) => updateField("discordActivity", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* ERWEITERT TAB */}
            {activeTab === "erweitert" && (
              <section>
                <h2 className="dash-pane-title">Erweitert</h2>
                <p className="dash-pane-sub">Volle Kontrolle für Profis.</p>

                <div className="dash-toggle-row">
                  <div>
                    <div className="dash-toggle-label">Aufrufzähler anzeigen</div>
                    <div className="dash-toggle-desc">Zeigt die Profilaufrufe im Footer</div>
                  </div>
                  <label className="dash-switch">
                    <input
                      type="checkbox"
                      checked={state.viewCounter}
                      onChange={(e) => updateField("viewCounter", e.target.checked)}
                    />
                    <span className="track" />
                  </label>
                </div>

                <div className="dash-field" style={{ marginTop: 14 }}>
                  <label htmlFor="f-viewcount">Aufrufe (Statistik)</label>
                  <input
                    type="number"
                    id="f-viewcount"
                    className="dash-input"
                    min={0}
                    value={state.viewCount}
                    onChange={(e) => updateField("viewCount", Number(e.target.value))}
                  />
                </div>

                <hr className="dash-sep" />

                <div className="dash-field">
                  <label htmlFor="f-customcss">Custom CSS</label>
                  <textarea
                    id="f-customcss"
                    className="dash-textarea"
                    rows={8}
                    placeholder=".lp-name { letter-spacing: 1px; }"
                    value={state.customCss}
                    onChange={(e) => updateField("customCss", e.target.value)}
                  />
                  <div className="hint">Wird direkt innerhalb deiner Profilkarte angewendet.</div>
                </div>

                <hr className="dash-sep" />
                <p className="hint" style={{ marginBottom: 12 }}>
                  Klicke oben auf <strong>Speichern</strong>, um alle deine Änderungen dauerhaft auf deiner Live-Seite zu sichern.
                </p>
              </section>
            )}
          </div>
        </div>

        {/* ================= PREVIEW STAGE ================= */}
        <main className="dash-preview-stage">
          <div className="dash-stage-glow">
            <div />
            <div />
          </div>

          <div className="dash-device-frame">
            <div
              className="lp-card"
              ref={cardRef}
              style={
                {
                  "--lp-a1": state.accent1,
                  "--lp-a2": state.accent2,
                  "--lp-font-d": activeFont.d,
                  "--lp-font-m": activeFont.m,
                  "--lp-radius": `${state.radius}px`,
                  background: state.cardStyle === "solid" ? "#111117" : "transparent",
                  borderColor: state.cardStyle === "outline" ? state.accent1 : "rgba(255,255,255,0.08)",
                  borderWidth: state.cardStyle === "outline" ? "1.5px" : "1px",
                } as React.CSSProperties
              }
            >
              {/* Background Layer */}
              <div
                className="lp-bg"
                style={{
                  background:
                    state.bgType === "color"
                      ? state.bgColor
                      : state.bgType === "gradient"
                      ? `linear-gradient(${state.bgAngle}deg, ${state.bgGrad1}, ${state.bgGrad2})`
                      : state.bgType === "image" && state.bgImage
                      ? `url("${state.bgImage}")`
                      : "#0a0a0f",
                  backgroundSize: state.bgType === "gradient" && state.bgAnimate ? "250% 250%" : "cover",
                  animation: state.bgType === "gradient" && state.bgAnimate ? "lpGradShift 10s ease infinite" : "none",
                }}
              >
                {state.bgType === "video" && state.bgVideo && (
                  <video src={state.bgVideo} autoPlay loop muted playsInline />
                )}
              </div>

              {/* Overlay */}
              <div
                className="lp-overlay"
                style={{ background: `rgba(6,6,10,${state.overlay / 100})` }}
              />

              {/* Canvas Particles */}
              <canvas className="lp-particles" ref={canvasRef} />

              {/* Live injected custom css */}
              {state.customCss && <style dangerouslySetInnerHTML={{ __html: state.customCss }} />}

              {/* Content */}
              <div className="lp-content">
                <div className="lp-avatar-wrap">
                  <div className={`lp-avatar shape-${state.avatarShape} ${state.avatarGlow ? "glow" : ""}`}>
                    <div
                      className="lp-avatar-inner"
                      style={{
                        backgroundImage: state.avatar ? `url("${state.avatar}")` : "none",
                      }}
                    >
                      {!state.avatar && (state.name?.trim().charAt(0).toUpperCase() || "?")}
                    </div>
                  </div>
                </div>

                <div className="lp-name-row">
                  <span className="lp-name">{state.name || "deinname"}</span>
                  <span style={{ display: "inline-flex", gap: 4 }}>
                    {state.badges.verified && (
                      <svg className="lp-badge" viewBox="0 0 24 24" fill="#3ba7ff">
                        <path d="M12 2l2.4 2.1 3.1-.5 1 3 2.9 1.4-.6 3.1 1.9 2.5-1.9 2.5.6 3.1-2.9 1.4-1 3-3.1-.5L12 22l-2.4-2.1-3.1.5-1-3-2.9-1.4.6-3.1L1.3 12l1.9-2.5-.6-3.1L5.5 5l1-3 3.1.5z" />
                        <path d="M8.5 12l2.3 2.3L16 9" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {state.badges.og && (
                      <svg className="lp-badge" viewBox="0 0 24 24" fill="#f59e0b">
                        <path d="M12 2l2.9 6.3L22 9l-5 5 1.3 7L12 17.8 5.7 21 7 14 2 9l7.1-.7z" />
                      </svg>
                    )}
                    {state.badges.premium && (
                      <svg className="lp-badge" viewBox="0 0 24 24" fill="#ec4899">
                        <path d="M3 8l4 3 5-6 5 6 4-3-2 11H5z" />
                      </svg>
                    )}
                  </span>
                </div>

                <div className="lp-handle">mybiolinkpage.de/{state.handle || "deinname"}</div>

                <div className="lp-bio">
                  {state.typewriter ? (
                    <>
                      <span>{typedBio}</span>
                      <span className="cursor-blink">&nbsp;</span>
                    </>
                  ) : (
                    state.bio || "✦ dein vibe, deine regeln ✦"
                  )}
                </div>

                {state.discordShow && (
                  <div className="lp-discord">
                    <span className="dot" />
                    <span className="txt">
                      <span className="st">{state.discordStatus || "Online"}</span>
                      <br />
                      <span className="ac">{state.discordActivity || "Spielt Visual Studio Code"}</span>
                    </span>
                  </div>
                )}

                {state.audioShow && (
                  <div className="lp-audio">
                    <div className="bars">
                      <span />
                      <span />
                      <span />
                    </div>
                    <span className="tt">
                      {state.audioUrl
                        ? state.audioAutoplay
                          ? "Spielt automatisch"
                          : "Track hinterlegt"
                        : "Kein Track hinterlegt"}
                    </span>
                  </div>
                )}

                <div className="lp-links">
                  {state.links.map((link) => {
                    const icon = ICONS[link.platform] || ICONS.website;
                    return (
                      <div key={link.id} className="lp-link">
                        <span className="ic" style={{ color: icon.color }}>
                          {icon.svg}
                        </span>
                        <span>{link.label || icon.label}</span>
                      </div>
                    );
                  })}
                </div>

                {state.viewCounter && (
                  <div className="lp-footer">
                    <span>{(state.viewCount || 0).toLocaleString("de-DE")} Aufrufe</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      <div className={`dash-toast ${toastMsg ? "show" : ""}`}>{toastMsg}</div>
    </div>
  );
}
