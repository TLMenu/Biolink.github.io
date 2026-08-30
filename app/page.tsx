import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-[#0a0a0f] to-[#15152b]">
      <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
        biolink
      </h1>
      <p className="text-zinc-400 max-w-md mb-8">
        Erstelle deine eigene, individuell gestaltbare Profilseite – mit
        eigenem Hintergrund, Musik, Effekten und all deinen Links an einem Ort.
      </p>
      <div className="flex gap-4">
        <Link
          href="/register"
          className="px-6 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 transition font-medium"
        >
          Kostenlos registrieren
        </Link>
        <Link
          href="/login"
          className="px-6 py-3 rounded-lg border border-zinc-700 hover:border-zinc-500 transition font-medium"
        >
          Login
        </Link>
      </div>
    </main>
  );
}
