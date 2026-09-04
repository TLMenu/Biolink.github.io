"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../app/auth.css";

export default function AuthForm({ initialMode }: { initialMode: "login" | "register" }) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  // Login fields
  const [loginUser, setLoginUser] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);

  // Register fields
  const [regUser, setRegUser] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPw, setRegPw] = useState("");
  const [regPw2, setRegPw2] = useState("");
  const [showRegPw, setShowRegPw] = useState(false);
  const [showRegPw2, setShowRegPw2] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginUser.trim(),
          password: loginPw,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Login fehlgeschlagen.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setLoading(false);
      setError("Verbindungsfehler. Bitte erneut versuchen.");
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (regPw !== regPw2) {
      setError("Passwörter stimmen nicht überein.");
      return;
    }

    if (regPw.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: regUser.trim(),
          email: regEmail.trim(),
          password: regPw,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Registrierung fehlgeschlagen.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setLoading(false);
      setError("Verbindungsfehler. Bitte erneut versuchen.");
    }
  }

  async function handleOAuth(provider: "google" | "github" | "discord") {
    setError(null);
    try {
      const res = await fetch(`/api/auth/oauth/${provider}`);
      if (res.redirected) {
        window.location.href = res.url;
        return;
      }
      const data = await res.json().catch(() => null);
      if (data?.error) {
        setError(`${data.error} ${data.detail || ""}`);
      } else {
        window.location.href = `/api/auth/oauth/${provider}`;
      }
    } catch {
      window.location.href = `/api/auth/oauth/${provider}`;
    }
  }

  return (
    <div className="auth-page">
      {/* Left: brand panel */}
      <aside className="auth-brand-panel">
        <div className="auth-brand-top">
          <Link href="/" className="auth-mark">
            <span className="auth-mark-glyph">TL</span>
            Biolink
          </Link>
        </div>

        <div className="auth-brand-mid">
          <h1 className="auth-brand-headline">Your bio, your links, your page.</h1>
          <p className="auth-brand-sub">
            Sign in to manage your profile, customize your page, and track your visitors on mybiolinkpage.de.
          </p>

          <div className="auth-stat-row">
            <div className="auth-stat">
              <b>20+</b>
              <span>Themes &amp; layouts</span>
            </div>
            <div className="auth-stat">
              <b>Live</b>
              <span>Visitor analytics</span>
            </div>
          </div>
        </div>

        <div className="auth-brand-bottom">
          <span className="auth-status-dot"></span>
          All systems operational
        </div>
      </aside>

      {/* Right: form panel */}
      <main className="auth-form-panel">
        <div className="auth-form-card">
          <div className="auth-tabs" data-active={mode} role="tablist">
            <div className="auth-tab-indicator" aria-hidden="true"></div>
            <button
              className="auth-tab-btn"
              role="tab"
              aria-selected={mode === "login"}
              type="button"
              onClick={() => { setMode("login"); setError(null); }}
            >
              Sign in
            </button>
            <button
              className="auth-tab-btn"
              role="tab"
              aria-selected={mode === "register"}
              type="button"
              onClick={() => { setMode("register"); setError(null); }}
            >
              Register
            </button>
          </div>

          {error && <div className="auth-error-banner">{error}</div>}

          {/* LOGIN */}
          {mode === "login" && (
            <section role="tabpanel">
              <div className="auth-form-head">
                <h1>Welcome back</h1>
                <p>Sign in to keep going with Biolink.</p>
              </div>

              <form onSubmit={handleLogin} noValidate>
                <div className="auth-field">
                  <label htmlFor="login-user">Email or Username</label>
                  <input
                    type="text"
                    id="login-user"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="login-pw">Password</label>
                  <div className="auth-pw-row">
                    <input
                      type={showLoginPw ? "text" : "password"}
                      id="login-pw"
                      value={loginPw}
                      onChange={(e) => setLoginPw(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="auth-pw-toggle"
                      onClick={() => setShowLoginPw(!showLoginPw)}
                    >
                      {showLoginPw ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="auth-row-between">
                  <div className="auth-checkbox-row">
                    <input type="checkbox" id="login-remember" defaultChecked />
                    <label htmlFor="login-remember">Stay signed in</label>
                  </div>
                  <a href="#" className="auth-link-quiet" onClick={(e) => e.preventDefault()}>
                    Forgot password?
                  </a>
                </div>

                <button type="submit" disabled={loading} className="auth-submit-btn">
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <div className="auth-divider">or continue with</div>

              <div className="auth-oauth-grid">
                <button
                  className="auth-oauth-btn"
                  type="button"
                  aria-label="Sign in with Google"
                  onClick={() => handleOAuth("google")}
                >
                  <svg viewBox="0 0 24 24"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.31 0-6.02-2.74-6.02-6.1S8.69 5.9 12 5.9c1.9 0 3.16.8 3.89 1.49l2.66-2.56C16.9 3.2 14.66 2.2 12 2.2 6.87 2.2 2.7 6.4 2.7 11.5S6.87 20.8 12 20.8c6.92 0 8.9-4.86 8.9-7.4 0-.5-.05-.87-.12-1.2H12z"/></svg>
                </button>
                <button
                  className="auth-oauth-btn"
                  type="button"
                  aria-label="Sign in with GitHub"
                  onClick={() => handleOAuth("github")}
                >
                  <svg viewBox="0 0 24 24" fill="#EDEBFA"><path d="M12 2C6.48 2 2 6.58 2 12.2c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.29 9.29 0 0 1 5 0c1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.2C22 6.58 17.52 2 12 2z"/></svg>
                </button>
                <button
                  className="auth-oauth-btn"
                  type="button"
                  aria-label="Sign in with Discord"
                  onClick={() => handleOAuth("discord")}
                >
                  <svg viewBox="0 0 24 24" fill="#5865F2"><path d="M20.3 5.4a17.5 17.5 0 0 0-4.3-1.3l-.2.4c1.5.4 2.9 1 4.2 1.8a13.6 13.6 0 0 0-16 0 12.5 12.5 0 0 1 4.2-1.8l-.2-.4c-1.5.3-2.9.7-4.3 1.3-2.6 3.9-3.3 7.6-3 11.3a17.6 17.6 0 0 0 5.3 2.7l.7-1.1c-.7-.3-1.4-.6-2-1.1.2-.1.3-.2.5-.3a12.5 12.5 0 0 0 10.6 0c.2.1.3.2.5.3-.6.4-1.3.8-2 1.1l.7 1.1a17.5 17.5 0 0 0 5.3-2.7c.4-4.3-.8-8-3-11.3zM9 14.6c-.9 0-1.6-.9-1.6-1.9 0-1.1.7-2 1.6-2s1.6.9 1.6 2c0 1-.7 1.9-1.6 1.9zm6 0c-.9 0-1.6-.9-1.6-1.9 0-1.1.7-2 1.6-2s1.6.9 1.6 2c0 1-.7 1.9-1.6 1.9z"/></svg>
                </button>
              </div>

              <p className="auth-switch-line">
                Don&apos;t have an account?{" "}
                <button type="button" onClick={() => { setMode("register"); setError(null); }}>
                  Create one
                </button>
              </p>
            </section>
          )}

          {/* REGISTER */}
          {mode === "register" && (
            <section role="tabpanel">
              <div className="auth-form-head">
                <h1>Create account</h1>
                <p>Sign up to set up Biolink on mybiolinkpage.de.</p>
              </div>

              <form onSubmit={handleRegister} noValidate>
                <div className="auth-field">
                  <label htmlFor="reg-user">Username</label>
                  <input
                    type="text"
                    id="reg-user"
                    value={regUser}
                    onChange={(e) => setRegUser(e.target.value)}
                    placeholder="your_username"
                    required
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="reg-email">Email</label>
                  <input
                    type="email"
                    id="reg-email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="reg-pw">Password</label>
                  <div className="auth-pw-row">
                    <input
                      type={showRegPw ? "text" : "password"}
                      id="reg-pw"
                      value={regPw}
                      onChange={(e) => setRegPw(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                    />
                    <button
                      type="button"
                      className="auth-pw-toggle"
                      onClick={() => setShowRegPw(!showRegPw)}
                    >
                      {showRegPw ? "Hide" : "Show"}
                    </button>
                  </div>
                  <p className="auth-field-hint">At least 8 characters recommended.</p>
                </div>

                <div className="auth-field">
                  <label htmlFor="reg-pw2">Confirm password</label>
                  <div className="auth-pw-row">
                    <input
                      type={showRegPw2 ? "text" : "password"}
                      id="reg-pw2"
                      value={regPw2}
                      onChange={(e) => setRegPw2(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="auth-pw-toggle"
                      onClick={() => setShowRegPw2(!showRegPw2)}
                    >
                      {showRegPw2 ? "Hide" : "Show"}
                    </button>
                  </div>
                  {regPw2 && regPw !== regPw2 && (
                    <span className="auth-field-error">Passwords don&apos;t match.</span>
                  )}
                </div>

                <div className="auth-row-between" style={{ marginBottom: 18 }}>
                  <div className="auth-checkbox-row">
                    <input type="checkbox" id="reg-remember" defaultChecked />
                    <label htmlFor="reg-remember">Stay signed in</label>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="auth-submit-btn">
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>

              <div className="auth-divider">or sign up with</div>

              <div className="auth-oauth-grid">
                <button
                  className="auth-oauth-btn"
                  type="button"
                  aria-label="Sign up with Google"
                  onClick={() => handleOAuth("google")}
                >
                  <svg viewBox="0 0 24 24"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.31 0-6.02-2.74-6.02-6.1S8.69 5.9 12 5.9c1.9 0 3.16.8 3.89 1.49l2.66-2.56C16.9 3.2 14.66 2.2 12 2.2 6.87 2.2 2.7 6.4 2.7 11.5S6.87 20.8 12 20.8c6.92 0 8.9-4.86 8.9-7.4 0-.5-.05-.87-.12-1.2H12z"/></svg>
                </button>
                <button
                  className="auth-oauth-btn"
                  type="button"
                  aria-label="Sign up with GitHub"
                  onClick={() => handleOAuth("github")}
                >
                  <svg viewBox="0 0 24 24" fill="#EDEBFA"><path d="M12 2C6.48 2 2 6.58 2 12.2c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.29 9.29 0 0 1 5 0c1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.2C22 6.58 17.52 2 12 2z"/></svg>
                </button>
                <button
                  className="auth-oauth-btn"
                  type="button"
                  aria-label="Sign up with Discord"
                  onClick={() => handleOAuth("discord")}
                >
                  <svg viewBox="0 0 24 24" fill="#5865F2"><path d="M20.3 5.4a17.5 17.5 0 0 0-4.3-1.3l-.2.4c1.5.4 2.9 1 4.2 1.8a13.6 13.6 0 0 0-16 0 12.5 12.5 0 0 1 4.2-1.8l-.2-.4c-1.5.3-2.9.7-4.3 1.3-2.6 3.9-3.3 7.6-3 11.3a17.6 17.6 0 0 0 5.3 2.7l.7-1.1c-.7-.3-1.4-.6-2-1.1.2-.1.3-.2.5-.3a12.5 12.5 0 0 0 10.6 0c.2.1.3.2.5.3-.6.4-1.3.8-2 1.1l.7 1.1a17.5 17.5 0 0 0 5.3-2.7c.4-4.3-.8-8-3-11.3zM9 14.6c-.9 0-1.6-.9-1.6-1.9 0-1.1.7-2 1.6-2s1.6.9 1.6 2c0 1-.7 1.9-1.6 1.9zm6 0c-.9 0-1.6-.9-1.6-1.9 0-1.1.7-2 1.6-2s1.6.9 1.6 2c0 1-.7 1.9-1.6 1.9z"/></svg>
                </button>
              </div>

              <p className="auth-switch-line">
                Already have an account?{" "}
                <button type="button" onClick={() => { setMode("login"); setError(null); }}>
                  Sign in
                </button>
              </p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
