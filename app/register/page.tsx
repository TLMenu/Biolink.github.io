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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0f] to-[#15152b] px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-zinc-900/70 border border-zinc-800 rounded-xl p-8 space-y-4"
      >
        <h1 className="text-2xl font-bold mb-2">Account erstellen</h1>

        <div>
          <label className="text-sm text-zinc-400">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 outline-none focus:border-violet-500"
            placeholder="deinname"
            required
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400">E-Mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 outline-none focus:border-violet-500"
            placeholder="du@example.com"
            required
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400">Passwort</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 outline-none focus:border-violet-500"
            placeholder="mind. 6 Zeichen"
            required
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 transition font-medium disabled:opacity-50"
        >
          {loading ? "Wird erstellt..." : "Registrieren"}
        </button>

        <p className="text-sm text-zinc-500 text-center">
          Schon einen Account?{" "}
          <Link href="/login" className="text-violet-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
