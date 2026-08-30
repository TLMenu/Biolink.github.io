import Link from "next/link";

export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--bg-base)" }}
    >
      <p
        className="text-xs uppercase tracking-[0.2em] mb-4"
        style={{ color: "var(--text-muted)" }}
      >
        deine seite, deine farbe
      </p>
      <h1
        className="text-5xl sm:text-6xl mb-4"
        style={{
          fontFamily: "var(--font-voice)",
          fontWeight: 500,
          color: "var(--text-primary)",
          letterSpacing: "-0.01em",
        }}
      >
        eine seite,
        <br />
        die dir gehört.
      </h1>
      <p
        className="max-w-md mb-10 leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        Eine Profilseite mit eigenem Hintergrund, Musik, Effekten und all
        deinen Links an einem Ort. Der Rahmen bleibt ruhig — was aufleuchtet,
        bestimmst du.
      </p>
      <div className="flex gap-3">
        <Link
          href="/register"
          className="px-6 py-3 rounded-lg font-medium transition"
          style={{
            background: "var(--text-primary)",
            color: "var(--bg-base)",
          }}
        >
          Kostenlos registrieren
        </Link>
        <Link
          href="/login"
          className="px-6 py-3 rounded-lg font-medium transition border"
          style={{
            borderColor: "var(--border-strong)",
            color: "var(--text-primary)",
          }}
        >
          Login
        </Link>
      </div>
    </main>
  );
}
