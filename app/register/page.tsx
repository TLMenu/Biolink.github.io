"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
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
            Deine Seite beginnt hier
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Ein Konto, eine eigene Adresse, volle Kontrolle.
          </p>
        </div>

        <div>
          <label className="text-sm block mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
            placeholder="deinname"
            required
          />
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
            placeholder="du@example.com"
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
            placeholder="mind. 6 Zeichen"
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
          {loading ? "Wird erstellt..." : "Konto erstellen"}
        </button>

        <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
          Schon einen Account?{" "}
          <Link href="/login" style={{ color: "var(--text-primary)" }} className="hover:underline">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
