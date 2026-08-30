"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Etwas ist schiefgelaufen.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--bg-base)" }}
    >
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl p-8 space-y-5"
        style={{ background: "var(--bg-surface)" }}
      >
        <div>
          <h1
            className="text-2xl mb-1"
            style={{
              fontFamily: "var(--font-voice)",
              fontWeight: 500,
              color: "var(--text-primary)",
            }}
          >
            Willkommen zurück
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Melde dich bei deiner Seite an.
          </p>
        </div>

        <div>
          <label className="text-sm block mb-1.5" style={{ color: "var(--text-secondary)" }}>
            E-Mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
        </div>

        <div>
          <label className="text-sm block mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Passwort
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
        </div>

        {error && (
          <p className="text-sm" style={{ color: "var(--danger)" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg font-medium transition disabled:opacity-50"
          style={{ background: "var(--text-primary)", color: "var(--bg-base)" }}
        >
          {loading ? "Wird eingeloggt..." : "Weiter"}
        </button>

        <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
          Noch keinen Account?{" "}
          <Link href="/register" style={{ color: "var(--text-primary)" }} className="hover:underline">
            Registrieren
          </Link>
        </p>
      </form>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          background: var(--bg-surface-2);
          border: 1px solid var(--border);
          padding: 0.6rem 0.8rem;
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
