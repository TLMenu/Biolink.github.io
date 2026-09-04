import Link from "next/link";
import "./landing.css";

export default function Home() {
  return (
    <div className="landing-page">
      {/* ---------- ambient background glow ---------- */}
      <div className="glow-field" aria-hidden="true">
        <div className="glow-blob b1" />
        <div className="glow-blob b2" />
        <div className="glow-blob b3" />
      </div>

      {/* ---------- nav ---------- */}
      <nav className="landing-nav">
        <div className="landing-wrap">
          <Link href="/" className="landing-logo">
            <img
              src="/BioLink-Icon.png"
              alt="biolink icon"
              width={26}
              height={26}
            />
            <span>biolink</span>
          </Link>
          <div className="landing-nav-actions">
            <Link href="/login" className="landing-btn landing-btn-quiet">
              Log in
            </Link>
            <Link href="/register" className="landing-btn landing-btn-primary">
              Claim Now
            </Link>
          </div>
        </div>
      </nav>

      <main className="landing-main">
        {/* ---------- hero ---------- */}
        <section className="landing-hero">
          <div className="landing-wrap">
            <div className="landing-badge">
              <span className="dot" /> Over 115K+ profiles worldwide
            </div>
            <h1>
              Your personal profile page.
              <br />
              <span className="grad">Completely customizable.</span>
            </h1>
            <p className="sub">
              Create a own feature-rich, 100% customizable profile page — with
              your own background, music, effects, and all your links in one
              place.
            </p>
            <div className="landing-hero-actions">
              <Link
                href="/register"
                className="landing-btn landing-btn-primary landing-btn-lg"
              >
                Claim your profile →
              </Link>
              <Link
                href="/login"
                className="landing-btn landing-btn-ghost landing-btn-lg"
              >
                Login
              </Link>
            </div>

            <div className="landing-stats">
              <div className="landing-stat">
                <span className="num">1.4M+</span>
                <span className="label">Website Views</span>
              </div>
              <div className="landing-stat">
                <span className="num">115K+</span>
                <span className="label">Users</span>
              </div>
              <div className="landing-stat">
                <span className="num">99.9%</span>
                <span className="label">Uptime</span>
              </div>
              <div className="landing-stat">
                <span className="num">35.5K+</span>
                <span className="label">Premium Users</span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- preview mock ---------- */}
        <section className="preview-section">
          <div className="landing-wrap">
            <div className="preview-frame">
              <div className="preview-avatar">
                <div className="preview-avatar-inner" />
              </div>
              <p className="preview-name">deinname</p>
              <p className="preview-handle">biolink.gg/deinname</p>
              <p className="preview-bio">✦ dein vibe, deine regeln ✦</p>
              <div className="preview-links">
                <div className="preview-link active">Discord</div>
                <div className="preview-link">Spotify</div>
                <div className="preview-link">Instagram</div>
              </div>
            </div>
            <p className="preview-caption">So individuell wie du sie gestaltest.</p>
          </div>
        </section>

        {/* ---------- features ---------- */}
        <section className="landing-section">
          <div className="landing-wrap">
            <div className="section-head">
              <h2>Alles, was deine Seite braucht</h2>
              <p>
                Vom ersten Login bis zum letzten Detail — jede Ecke deines
                Profils lässt sich anpassen.
              </p>
            </div>
            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon" aria-hidden="true">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
                <h3>Hintergrund</h3>
                <p>
                  Farbe, Bild, Video oder GIF — dein Profil sieht aus wie du es
                  willst.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon" aria-hidden="true">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                </div>
                <h3>Musik</h3>
                <p>
                  Eigener Track mit Autoplay — dein Sound, sobald jemand deine
                  Seite öffnet.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon" aria-hidden="true">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  </svg>
                </div>
                <h3>Partikel-Effekte</h3>
                <p>
                  Schnee, Sterne oder Funken — Bewegung, die deine Seite
                  lebendig macht.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon" aria-hidden="true">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <h3>Custom CSS</h3>
                <p>
                  Für die volle Kontrolle — schreib dein eigenes CSS direkt im
                  Dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- pricing ---------- */}
        <section className="landing-section">
          <div className="landing-wrap">
            <div className="section-head">
              <h2>Wähle deinen Plan</h2>
              <p>Kostenlos starten, jederzeit upgraden.</p>
            </div>
            <div className="pricing-grid">
              <div className="plan">
                <h3>Free</h3>
                <p className="price">
                  0€<span>/lifetime</span>
                </p>
                <p className="desc">
                  Für den Einstieg — alle Links an einem Ort.
                </p>
                <ul>
                  <li>Basis-Customization</li>
                  <li>Basis-Effekte</li>
                  <li>Unbegrenzte Links</li>
                </ul>
                <Link href="/register" className="landing-btn landing-btn-ghost">
                  Get Started
                </Link>
              </div>

              <div className="plan popular">
                <span className="plan-badge">Beliebt</span>
                <h3>Premium</h3>
                <p className="price">
                  5,99€<span>/lifetime</span>
                </p>
                <p className="desc">
                  Volle Kontrolle über jedes Detail deiner Seite.
                </p>
                <ul>
                  <li>Exklusives Badge</li>
                  <li>Erweiterte Layouts &amp; Fonts</li>
                  <li>Typewriter-Animation</li>
                  <li>Alle Partikel-Effekte</li>
                  <li>Custom CSS &amp; SEO</li>
                </ul>
                <Link
                  href="/register"
                  className="landing-btn landing-btn-primary"
                >
                  Upgrade
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- final cta ---------- */}
        <section className="final-cta">
          <div className="landing-wrap">
            <h2>Bereit, deine Seite zu claimen?</h2>
            <div className="landing-hero-actions" style={{ marginBottom: 0 }}>
              <Link
                href="/register"
                className="landing-btn landing-btn-primary landing-btn-lg"
              >
                Konto erstellen
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- footer ---------- */}
      <footer className="landing-footer">
        <div className="landing-wrap">
          <span className="brand">
            <img
              src="/BioLink-Icon.png"
              alt="biolink icon"
              width={18}
              height={18}
            />
            biolink
          </span>
          <span>
            <Link href="/login">Login</Link> ·{" "}
            <Link href="/register">Registrieren</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
