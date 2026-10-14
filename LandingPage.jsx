import { useEffect, useRef, useState } from "react";

export default function LandingPage({
  onGetStarted,
  onDashboard,
  isSignedIn = false,
}) {
  const heroRef = useRef(null);
  const [activeDemo, setActiveDemo] = useState(0);
  const demoPrompts = [
    {
      question: "What are the main findings?",
      answer: "The study found a 28% increase in retention after introducing shorter onboarding sessions.",
      source: "research-brief.pdf · page 4",
    },
    {
      question: "Summarize the recommendations",
      answer: "The report recommends a phased launch, monthly progress reviews, and a dedicated support team.",
      source: "project-report.pdf · page 12",
    },
    {
      question: "Which risks should we know about?",
      answer: "The main risks are delayed supplier delivery and limited capacity during the initial rollout.",
      source: "risk-review.pdf · page 7",
    },
  ];

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="lp">
      <style>{`
        .lp {
          min-height: 100vh;
          background: var(--black);
          color: var(--text);
          font-family: var(--font-mono);
          display: flex;
          flex-direction: column;
        }

        /* ── Nav ── */
        .lp-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 40px;
          border-bottom: 0.5px solid var(--border);
          background: var(--surface);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .lp-nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .lp-nav-brand span {
          font-family: var(--font-display);
          font-size: 17px;
          font-weight: 600;
          color: var(--gold);
          letter-spacing: 0.05em;
        }
        .lp-nav-links {
          display: flex;
          gap: 28px;
        }
        .lp-nav-links a,
        .lp-nav-links button {
          font-size: 11px;
          color: var(--text-muted);
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 0.2s;
          font-family: inherit;
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
        }
        .lp-nav-links a:hover,
        .lp-nav-links button:hover { color: var(--gold); }
        .lp-nav-cta {
          padding: 7px 18px;
          background: var(--gold);
          color: #080808;
          border: none;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 500;
          font-family: var(--font-mono);
          cursor: pointer;
          letter-spacing: 0.05em;
          transition: background 0.2s, transform 0.15s;
        }
        .lp-nav-cta:hover { background: var(--gold-light); }
        .lp-nav-cta:active { transform: scale(0.97); }

        /* ── Hero ── */
        .lp-hero {
          flex: 1;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: clamp(36px, 7vw, 88px);
          text-align: left;
          padding: 76px 40px 84px;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
          --mx: 50%;
          --my: 50%;
        }
        .lp-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(600px circle at var(--mx) var(--my), rgba(201,168,76,0.07) 0%, transparent 60%);
          pointer-events: none;
          transition: background 0.1s;
        }
        .lp-hero-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(201,168,76,0.06) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
        }
        .lp-hero-copy {
          flex: 1 1 52%;
          max-width: 590px;
          position: relative;
          z-index: 1;
        }
        .lp-preview {
          flex: 1 1 48%;
          max-width: 470px;
          min-width: 0;
          position: relative;
          z-index: 1;
          padding: 1px;
          border: 1px solid rgba(211,174,72,0.32);
          border-radius: 18px;
          background: linear-gradient(145deg, rgba(211,174,72,0.14), rgba(16,16,16,0.4) 48%);
          box-shadow: 0 28px 90px rgba(0,0,0,0.42), 0 0 60px rgba(211,174,72,0.07);
          transform: perspective(1100px) rotateY(-4deg) rotateX(2deg);
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
        .lp-preview:hover {
          transform: perspective(1100px) rotateY(0) rotateX(0) translateY(-4px);
          box-shadow: 0 34px 100px rgba(0,0,0,0.5), 0 0 70px rgba(211,174,72,0.11);
        }
        .lp-preview-window {
          overflow: hidden;
          border-radius: 17px;
          background: #10100f;
        }
        .lp-preview-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 14px 17px;
          border-bottom: 1px solid var(--border);
          background: rgba(255,255,255,0.015);
        }
        .lp-window-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--gold-dim);
          opacity: 0.7;
        }
        .lp-window-title {
          margin-left: auto;
          color: var(--text-muted);
          font-size: 9px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }
        .lp-preview-body { padding: 22px; }
        .lp-preview-file {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 12px;
          border: 1px solid rgba(211,174,72,0.15);
          border-radius: 10px;
          background: rgba(211,174,72,0.045);
        }
        .lp-preview-file-icon {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          color: var(--gold);
          background: var(--gold-faint);
        }
        .lp-preview-file-name { color: var(--text); font-size: 10px; }
        .lp-preview-file-meta { margin-top: 4px; color: var(--text-muted); font-size: 9px; }
        .lp-preview-indexed {
          margin-left: auto;
          padding: 4px 7px;
          border: 1px solid rgba(129,199,132,0.18);
          border-radius: 20px;
          color: #81C784;
          font-size: 8px;
          letter-spacing: 0.05em;
        }
        .lp-preview-label {
          margin: 23px 0 10px;
          color: var(--text-muted);
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .lp-prompt-list { display: flex; flex-wrap: wrap; gap: 7px; }
        .lp-prompt {
          padding: 7px 9px;
          border: 1px solid var(--border);
          border-radius: 7px;
          background: transparent;
          color: var(--text-muted);
          font: inherit;
          font-size: 9px;
          cursor: pointer;
          transition: color 0.2s, background 0.2s, border-color 0.2s;
        }
        .lp-prompt:hover, .lp-prompt.active {
          border-color: rgba(211,174,72,0.55);
          background: var(--gold-faint);
          color: var(--gold-light);
        }
        .lp-preview-answer {
          margin-top: 16px;
          padding: 15px;
          border: 1px solid rgba(211,174,72,0.13);
          border-radius: 10px;
          background: rgba(255,255,255,0.025);
          animation: lp-answer-in 0.28s ease both;
        }
        .lp-answer-heading {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 9px;
          color: var(--gold);
          font-size: 9px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }
        .lp-answer-heading span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gold);
          box-shadow: 0 0 10px rgba(211,174,72,0.6);
        }
        .lp-preview-answer p {
          color: #c9c4b8;
          font-size: 10px;
          line-height: 1.8;
        }
        .lp-preview-source {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 12px;
          color: var(--text-muted);
          font-size: 9px;
        }
        @keyframes lp-answer-in {
          from { opacity: 0.3; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .lp-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 5px 14px;
          border-radius: 20px;
          border: 0.5px solid var(--border);
          background: var(--surface);
          font-size: 10px;
          color: var(--gold-dim);
          letter-spacing: 0.06em;
          margin-bottom: 24px;
          position: relative;
          z-index: 1;
        }
        .lp-badge-dot {
          width: 5px;
          height: 5px;
          background: var(--gold);
          border-radius: 50%;
          animation: glow 2.5s ease-in-out infinite;
        }
        .lp-headline {
          font-family: var(--font-display);
          font-size: clamp(42px, 5.3vw, 68px);
          font-weight: 600;
          color: var(--text);
          line-height: 1.12;
          max-width: 580px;
          letter-spacing: -0.01em;
          margin-bottom: 18px;
          position: relative;
          z-index: 1;
        }
        .lp-headline em {
          color: var(--gold);
          font-style: normal;
        }
        .lp-sub {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.75;
          max-width: 500px;
          margin-bottom: 30px;
          position: relative;
          z-index: 1;
        }
        .lp-actions {
          display: flex;
          gap: 12px;
          align-items: center;
          position: relative;
          z-index: 1;
          flex-wrap: wrap;
          justify-content: flex-start;
        }
        .lp-trust-note {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 18px;
          color: var(--text-muted);
          font-size: 10px;
          letter-spacing: 0.02em;
        }
        .lp-trust-note svg { color: var(--gold-dim); flex-shrink: 0; }
        .lp-btn-primary {
          padding: 12px 28px;
          background: var(--gold);
          color: #080808;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          font-family: var(--font-mono);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          letter-spacing: 0.04em;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .lp-btn-primary:hover {
          background: var(--gold-light);
          box-shadow: 0 6px 24px rgba(201,168,76,0.25);
        }
        .lp-btn-primary:active { transform: scale(0.97); }
        .lp-btn-ghost {
          padding: 12px 24px;
          background: transparent;
          color: var(--text-muted);
          border: 0.5px solid var(--border);
          border-radius: 10px;
          font-size: 13px;
          font-family: var(--font-mono);
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: border-color 0.2s, color 0.2s;
        }
        .lp-btn-ghost:hover { border-color: var(--gold); color: var(--gold); }

        /* ── Stats strip ── */
        .lp-stats {
          display: flex;
          justify-content: center;
          gap: 0;
          border-top: 0.5px solid var(--border);
          border-bottom: 0.5px solid var(--border);
          background: var(--surface);
        }
        .lp-stat {
          flex: 1;
          max-width: 200px;
          padding: 28px 20px;
          text-align: center;
          border-right: 0.5px solid var(--border);
        }
        .lp-stat:last-child { border-right: none; }
        .lp-stat-num {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 600;
          color: var(--gold);
          line-height: 1;
          margin-bottom: 6px;
        }
        .lp-stat-label {
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.06em;
        }

        /* ── Features ── */
        .lp-features {
          padding: 72px 40px;
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
        }
        .lp-section-label {
          font-size: 10px;
          color: var(--gold-dim);
          letter-spacing: 0.1em;
          margin-bottom: 12px;
        }
        .lp-section-title {
          font-family: var(--font-display);
          font-size: 30px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 48px;
          max-width: 480px;
          line-height: 1.25;
        }
        .lp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1px;
          border: 0.5px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          background: var(--border);
        }
        .lp-feature {
          background: var(--surface);
          padding: 28px 26px;
          transition: background 0.2s;
        }
        .lp-feature:hover { background: var(--surface2); }
        .lp-feature-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--gold-faint);
          border: 0.5px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
          margin-bottom: 16px;
        }
        .lp-feature-title {
          font-size: 13px;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 8px;
          letter-spacing: 0.02em;
        }
        .lp-feature-desc {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.7;
        }

        /* ── How it works ── */
        .lp-how {
          padding: 72px 40px;
          border-top: 0.5px solid var(--border);
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
        }
        .lp-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 32px;
          margin-top: 40px;
          position: relative;
        }
        .lp-step {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .lp-step-num {
          font-family: var(--font-display);
          font-size: 42px;
          font-weight: 600;
          color: var(--surface3);
          line-height: 1;
          user-select: none;
        }
        .lp-step-title {
          font-size: 13px;
          font-weight: 500;
          color: var(--text);
        }
        .lp-step-desc {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.7;
        }

        /* ── CTA band ── */
        .lp-cta-band {
          margin: 0 40px 72px;
          border: 0.5px solid var(--border);
          border-radius: 14px;
          background: var(--surface);
          padding: 48px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
        }
        .lp-cta-band h2 {
          font-family: var(--font-display);
          font-size: 26px;
          font-weight: 600;
          color: var(--text);
          line-height: 1.3;
          max-width: 420px;
        }
        .lp-cta-band h2 em {
          color: var(--gold);
          font-style: normal;
        }

        /* ── Footer ── */
        .lp-footer {
          border-top: 0.5px solid var(--border);
          padding: 20px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--surface);
        }
        .lp-footer-brand {
          font-family: var(--font-display);
          font-size: 14px;
          color: var(--gold-dim);
          letter-spacing: 0.04em;
        }
        .lp-footer-copy {
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }

        @media (max-width: 640px) {
          .lp-nav { padding: 14px 20px; }
          .lp-nav-links { display: none; }
          .lp-hero {
            flex-direction: column;
            align-items: stretch;
            gap: 42px;
            padding: 58px 20px 54px;
            text-align: center;
          }
          .lp-hero-copy { max-width: none; }
          .lp-preview { width: 100%; max-width: 500px; margin: 0 auto; transform: none; }
          .lp-preview:hover { transform: translateY(-3px); }
          .lp-badge { margin-left: auto; margin-right: auto; }
          .lp-headline { font-size: clamp(40px, 11vw, 56px); }
          .lp-sub { margin-left: auto; margin-right: auto; }
          .lp-actions { justify-content: center; }
          .lp-trust-note { justify-content: center; }
          .lp-preview-body { padding: 16px; }
          .lp-features, .lp-how { padding: 48px 20px; }
          .lp-cta-band { margin: 0 20px 48px; padding: 32px 24px; }
          .lp-footer { padding: 16px 20px; }
          .lp-stats { flex-wrap: wrap; }
          .lp-stat { min-width: 50%; border-bottom: 0.5px solid var(--border); }
        }
      `}</style>

      {/* Nav */}
      <nav className="lp-nav">
        <div className="lp-nav-brand">
          <div className="logo-ring" style={{ width: 32, height: 32 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14Z"/>
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14Z"/>
            </svg>
          </div>
          <span>DocMind AI</span>
        </div>
        <div className="lp-nav-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          {onDashboard && <button onClick={onDashboard}>Dashboard</button>}
        </div>
        <button className="lp-nav-cta" onClick={onGetStarted}>
          {isSignedIn ? "Open workspace" : "Sign in"}
        </button>
      </nav>

      {/* Hero */}
      <section className="lp-hero" ref={heroRef}>
        <div className="lp-hero-grid" />
        <div className="lp-hero-copy">
          <div className="lp-badge">
            <span className="lp-badge-dot" />
            YOUR DOCUMENTS, IN CONVERSATION
          </div>
          <h1 className="lp-headline">
            Make every page<br />make sense.
          </h1>
          <p className="lp-sub">
            Ask questions in plain language. Get clear answers grounded in your PDFs, with the source pages to prove it.
          </p>
          <div className="lp-actions">
            <button className="lp-btn-primary" onClick={onGetStarted}>
              {isSignedIn ? "Open your workspace" : "Get started for free"}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </button>
            <button className="lp-btn-ghost" onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}>
              See how it works
            </button>
          </div>
          <p className="lp-trust-note">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>
            </svg>
            No account needed · Your documents stay yours
          </p>
        </div>

        <div className="lp-preview" aria-label="Interactive example of DocMind answering document questions">
          <div className="lp-preview-window">
            <div className="lp-preview-bar">
              <span className="lp-window-dot" />
              <span className="lp-window-dot" />
              <span className="lp-window-dot" />
              <span className="lp-window-title">DocMind workspace</span>
            </div>
            <div className="lp-preview-body">
              <div className="lp-preview-file">
                <div className="lp-preview-file-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>
                  </svg>
                </div>
                <div>
                  <div className="lp-preview-file-name">research-brief.pdf</div>
                  <div className="lp-preview-file-meta">24 pages · Ready to ask</div>
                </div>
                <span className="lp-preview-indexed">● INDEXED</span>
              </div>
              <div className="lp-preview-label">Try a sample question</div>
              <div className="lp-prompt-list" role="group" aria-label="Sample document questions">
                {demoPrompts.map((prompt, index) => (
                  <button
                    key={prompt.question}
                    className={`lp-prompt ${activeDemo === index ? "active" : ""}`}
                    onClick={() => setActiveDemo(index)}
                    aria-pressed={activeDemo === index}
                  >
                    {prompt.question}
                  </button>
                ))}
              </div>
              <div className="lp-preview-answer" key={activeDemo} aria-live="polite">
                <div className="lp-answer-heading"><span /> Answer from your document</div>
                <p>{demoPrompts[activeDemo].answer}</p>
                <div className="lp-preview-source">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>
                  </svg>
                  Source: {demoPrompts[activeDemo].source}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="lp-stats">
        {[
          { num: "PDF", label: "Upload and ask" },
          { num: "Cited", label: "Answers with sources" },
          { num: "Private", label: "Your own documents" },
          { num: "AI", label: "Plain-language questions" },
        ].map((s) => (
          <div className="lp-stat" key={s.label}>
            <div className="lp-stat-num">{s.num}</div>
            <div className="lp-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <section className="lp-features" id="features">
        <p className="lp-section-label">Capabilities</p>
        <h2 className="lp-section-title">Everything you need to interrogate a document</h2>
        <div className="lp-grid">
          {[
            {
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
              title: "Semantic Q&A",
              desc: "Ask in natural language. The system finds the most relevant chunks before answering — not just keyword matches.",
            },
            {
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>,
              title: "PDF ingestion",
              desc: "Drag and drop any PDF. Pages are chunked, embedded with E5-base-v2, and stored in MongoDB Atlas vector search.",
            },
            {
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
              title: "Source tracing",
              desc: "Every answer cites the exact chunks it drew from, so you can verify without reading the entire document.",
            },
            {
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
              title: "Admin dashboard",
              desc: "Monitor ingested docs, query volume, chunk counts, and system health from a single view.",
            },
            {
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
              title: "Phi-3 Mini LLM",
              desc: "Answers are generated locally with Microsoft Phi-3-mini-4k-instruct — fast, private, no external API calls.",
            },
            {
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
              title: "Private by design",
              desc: "Your documents stay on your infrastructure. No data leaves your stack.",
            },
          ].map((f) => (
            <div className="lp-feature" key={f.title}>
              <div className="lp-feature-icon">{f.icon}</div>
              <div className="lp-feature-title">{f.title}</div>
              <p className="lp-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="lp-how" id="how">
        <p className="lp-section-label">Process</p>
        <h2 className="lp-section-title">From PDF to answer in three steps</h2>
        <div className="lp-steps">
          {[
            { n: "1", title: "Upload", desc: "Drop a PDF into the sidebar. The backend extracts text, splits it into overlapping chunks, and embeds each one." },
            { n: "2", title: "Search", desc: "Your query is embedded and compared against stored vectors. The top-k most relevant chunks are retrieved." },
            { n: "3", title: "Answer", desc: "Retrieved chunks are passed as context to Phi-3. The model synthesises a grounded answer and returns source references." },
          ].map((s) => (
            <div className="lp-step" key={s.n}>
              <div className="lp-step-num">{s.n}</div>
              <div className="lp-step-title">{s.title}</div>
              <p className="lp-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <div className="lp-cta-band">
        <h2>Ready to talk to your documents?<br /><em>It takes 30 seconds.</em></h2>
        <button className="lp-btn-primary" onClick={onGetStarted} style={{ fontSize: 13, padding: "13px 32px" }}>
          {isSignedIn ? "Open DocMind" : "Get started"}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        </button>
      </div>

      {/* Footer */}
      <footer className="lp-footer">
        <span className="lp-footer-brand">DocMind AI</span>
        <span className="lp-footer-copy">Built with FastAPI · MongoDB Atlas · Phi-3</span>
      </footer>
    </div>
  );
}
