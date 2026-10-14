import { useState } from "react";

export default function Login({ onLogin, onBack }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!username.trim()) newErrors.username = "Username is required.";
        if (!email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Enter a valid email address.";
        }
        return newErrors;
    };

    const handleLogin = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        setIsLoading(true);
        // Simulate a brief auth delay, then call onLogin
        await new Promise((r) => setTimeout(r, 900));
        setIsLoading(false);
        if (onLogin) onLogin({ username, email });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleLogin();
    };

    return (
        <div className="login-page">
            {/* Ambient background grid */}
            <div className="login-grid" aria-hidden="true" />

            {onBack && (
                <button className="login-back" onClick={onBack}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    Back to home
                </button>
            )}

            <div className="login-card">
                {/* Logo */}
                <div className="login-logo">
                    <div className="logo-ring" style={{ width: 48, height: 48 }}>
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14Z" />
                            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14Z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="login-title">DocMind AI</h1>
                        <p className="login-subtitle">RAG-powered document assistant</p>
                    </div>
                </div>

                <div className="login-divider" />

                <p className="login-welcome">Sign in to continue</p>

                {/* Username field */}
                <div className="field-group">
                    <label className="field-label" htmlFor="username">
                        Username
                    </label>
                    <div className={`field-wrap ${errors.username ? "field-error" : ""}`}>
                        <span className="field-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </span>
                        <input
                            id="username"
                            type="text"
                            className="field-input"
                            placeholder="e.g. mohamed_dev"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (errors.username) setErrors((prev) => ({ ...prev, username: "" }));
                            }}
                            onKeyDown={handleKeyDown}
                            autoComplete="username"
                            autoFocus
                        />
                    </div>
                    {errors.username && <span className="field-err-msg">{errors.username}</span>}
                </div>

                {/* Email field */}
                <div className="field-group">
                    <label className="field-label" htmlFor="email">
                        Email
                    </label>
                    <div className={`field-wrap ${errors.email ? "field-error" : ""}`}>
                        <span className="field-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                        </span>
                        <input
                            id="email"
                            type="email"
                            className="field-input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                            }}
                            onKeyDown={handleKeyDown}
                            autoComplete="email"
                        />
                    </div>
                    {errors.email && <span className="field-err-msg">{errors.email}</span>}
                </div>

                {/* Login button */}
                <button
                    className={`login-btn ${isLoading ? "login-btn--loading" : ""}`}
                    onClick={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="btn-spinner" />
                            Signing in…
                        </>
                    ) : (
                        <>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" x2="3" y1="12" y2="12" />
                            </svg>
                            Sign In
                        </>
                    )}
                </button>

                <p className="login-note">
                    No account needed — just enter any username and email to get started.
                </p>
            </div>

            <style>{`
        /* ── Login page ─────────────────────────── */
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--black);
          position: relative;
          overflow: hidden;
          padding: 24px;
        }

        /* Subtle dot-grid background */
        .login-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(201,168,76,0.07) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
        }

        .login-back {
          position: absolute;
          top: 24px;
          left: 28px;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 9px 12px;
          background: rgba(16,16,16,0.8);
          color: var(--text-muted);
          font: 11px var(--font-mono);
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
        }
        .login-back:hover { color: var(--gold); border-color: var(--gold); }

        /* Warm radial glow behind card */
        .login-page::before {
          content: "";
          position: absolute;
          width: 480px;
          height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        @media (max-width: 480px) {
          .login-back { top: 14px; left: 14px; }
        }

        /* ── Card ───────────────────────────────── */
        .login-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 400px;
          background: var(--surface);
          border: 0.5px solid var(--border);
          border-radius: 16px;
          padding: 36px 32px 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          box-shadow: 0 0 0 1px rgba(201,168,76,0.04), 0 24px 60px rgba(0,0,0,0.6);
          animation: cardIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Logo row ───────────────────────────── */
        .login-logo {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .login-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 600;
          color: var(--gold);
          letter-spacing: 0.06em;
          line-height: 1.2;
        }

        .login-subtitle {
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-top: 3px;
        }

        .login-divider {
          height: 0.5px;
          background: var(--border);
          margin: 0 -4px;
        }

        .login-welcome {
          font-size: 12px;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }

        /* ── Fields ─────────────────────────────── */
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label {
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .field-wrap {
          display: flex;
          align-items: center;
          background: var(--surface2);
          border: 0.5px solid var(--border);
          border-radius: var(--radius);
          transition: border-color 0.2s, box-shadow 0.2s;
          overflow: hidden;
        }

        .field-wrap:focus-within {
          border-color: var(--gold);
          box-shadow: 0 0 0 2px rgba(201,168,76,0.1);
        }

        .field-wrap.field-error {
          border-color: #EF9A9A;
        }

        .field-icon {
          padding: 0 10px 0 12px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .field-wrap:focus-within .field-icon {
          color: var(--gold-dim);
        }

        .field-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 10px 14px 10px 0;
          font-size: 13px;
          color: var(--text);
          font-family: var(--font-mono);
          line-height: 1.5;
        }

        .field-input::placeholder {
          color: var(--text-muted);
          opacity: 0.6;
        }

        .field-err-msg {
          font-size: 11px;
          color: #EF9A9A;
          letter-spacing: 0.02em;
        }

        /* ── Login button ───────────────────────── */
        .login-btn {
          margin-top: 4px;
          width: 100%;
          padding: 11px 0;
          background: var(--gold);
          color: #080808;
          border: none;
          border-radius: var(--radius);
          font-size: 13px;
          font-weight: 500;
          font-family: var(--font-mono);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          letter-spacing: 0.05em;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }

        .login-btn:hover:not(:disabled) {
          background: var(--gold-light);
          box-shadow: 0 4px 20px rgba(201,168,76,0.25);
        }

        .login-btn:active:not(:disabled) {
          transform: scale(0.97);
        }

        .login-btn:disabled {
          background: var(--surface3);
          color: var(--text-muted);
          cursor: not-allowed;
        }

        /* Spinner */
        .btn-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(8,8,8,0.3);
          border-top-color: #080808;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ── Footer note ─────────────────────────── */
        .login-note {
          font-size: 11px;
          color: var(--text-muted);
          text-align: center;
          line-height: 1.6;
          opacity: 0.7;
        }

        /* ── Responsive ──────────────────────────── */
        @media (max-width: 480px) {
          .login-card {
            padding: 28px 20px 22px;
          }
        }
      `}</style>
        </div>
    );
}
