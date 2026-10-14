import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8000";

// ── Small reusable chart (pure CSS bar) ──────────────────────────
function MiniBar({ values = [], color = "var(--gold)" }) {
  const max = Math.max(...values, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 40 }}>
      {values.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${(v / max) * 100}%`,
            background: color,
            borderRadius: 2,
            opacity: i === values.length - 1 ? 1 : 0.35 + (i / values.length) * 0.5,
            minHeight: 3,
          }}
        />
      ))}
    </div>
  );
}

// ── Stat card ────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, trend, sparkline }) {
  return (
    <div className="db-stat-card">
      <div className="db-stat-top">
        <div className="db-stat-icon">{icon}</div>
        {trend != null && (
          <span className={`db-stat-trend ${trend >= 0 ? "up" : "down"}`}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="db-stat-val">{value}</div>
      <div className="db-stat-label">{label}</div>
      {sub && <div className="db-stat-sub">{sub}</div>}
      {sparkline && (
        <div style={{ marginTop: 12 }}>
          <MiniBar values={sparkline} />
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────
export default function Dashboard({ user, onBack, docs: propDocs = [] }) {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const [statsResult, logsResult] = await Promise.allSettled([
        fetchDashboardData("/admin/stats"),
        fetchDashboardData("/admin/logs"),
      ]);
      if (!cancelled) {
        const hasStats =
          statsResult.status === "fulfilled" && isStatsPayload(statsResult.value);
        const hasLogs =
          logsResult.status === "fulfilled" && isQueryLogPayload(logsResult.value);

        setStats(hasStats ? statsResult.value : mockStats(propDocs));
        setLogs(hasLogs ? logsResult.value : mockLogs());

        if (!hasStats || !hasLogs) {
          console.warn("Dashboard API data unavailable; showing fallback data.", {
            stats: statsResult.status === "rejected" ? statsResult.reason : undefined,
            logs: logsResult.status === "rejected" ? logsResult.reason : undefined,
          });
        }
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [propDocs]);

  const docsToShow = Array.isArray(stats?.docs) ? stats.docs : propDocs;

  return (
    <div className="db">
      <style>{`
        .db {
          min-height: 100vh;
          background: var(--black);
          color: var(--text);
          font-family: var(--font-mono);
          display: flex;
          flex-direction: column;
        }
        /* ── Top bar ── */
        .db-topbar {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 28px;
          background: var(--surface);
          border-bottom: 0.5px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 40;
          flex-shrink: 0;
        }
        .db-back {
          background: transparent;
          border: 0.5px solid var(--border);
          border-radius: 7px;
          color: var(--text-muted);
          cursor: pointer;
          padding: 6px 10px;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-family: var(--font-mono);
          transition: border-color 0.2s, color 0.2s;
        }
        .db-back:hover { border-color: var(--gold); color: var(--gold); }
        .db-topbar-title {
          font-family: var(--font-display);
          font-size: 17px;
          font-weight: 600;
          color: var(--gold);
          letter-spacing: 0.04em;
        }
        .db-topbar-sub {
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          margin-left: 4px;
        }
        .db-topbar-user {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .db-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--gold);
          color: #080808;
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .db-user-name {
          font-size: 11px;
          color: var(--text-muted);
        }

        /* ── Tabs ── */
        .db-tabs {
          display: flex;
          gap: 2px;
          padding: 0 28px;
          background: var(--surface);
          border-bottom: 0.5px solid var(--border);
        }
        .db-tab {
          padding: 11px 18px;
          font-size: 11px;
          font-family: var(--font-mono);
          color: var(--text-muted);
          border: none;
          background: transparent;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          letter-spacing: 0.04em;
          transition: color 0.2s, border-color 0.2s;
        }
        .db-tab.active {
          color: var(--gold);
          border-bottom-color: var(--gold);
        }
        .db-tab:hover:not(.active) { color: var(--text); }

        /* ── Content ── */
        .db-content {
          flex: 1;
          padding: 28px;
          max-width: 1100px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* ── Stat grid ── */
        .db-stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1px;
          background: var(--border);
          border: 0.5px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }
        .db-stat-card {
          background: var(--surface);
          padding: 22px 20px;
          transition: background 0.15s;
        }
        .db-stat-card:hover { background: var(--surface2); }
        .db-stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .db-stat-icon {
          width: 30px;
          height: 30px;
          border-radius: 7px;
          background: var(--gold-faint);
          border: 0.5px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
        }
        .db-stat-trend {
          font-size: 10px;
          padding: 2px 7px;
          border-radius: 20px;
          letter-spacing: 0.04em;
        }
        .db-stat-trend.up { background: rgba(76,175,80,0.1); color: #81C784; }
        .db-stat-trend.down { background: rgba(229,57,53,0.1); color: #EF9A9A; }
        .db-stat-val {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 600;
          color: var(--text);
          line-height: 1;
          margin-bottom: 4px;
        }
        .db-stat-label {
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.06em;
        }
        .db-stat-sub {
          font-size: 10px;
          color: var(--gold-dim);
          margin-top: 4px;
        }

        /* ── Section heading ── */
        .db-section-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .db-section-title {
          font-size: 12px;
          font-weight: 500;
          color: var(--text);
          letter-spacing: 0.04em;
        }
        .db-section-badge {
          font-size: 10px;
          color: var(--text-muted);
        }

        /* ── Doc table ── */
        .db-table-wrap {
          border: 0.5px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
        }
        .db-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        .db-table th {
          background: var(--surface);
          padding: 10px 16px;
          text-align: left;
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          border-bottom: 0.5px solid var(--border);
          font-weight: 400;
        }
        .db-table td {
          padding: 11px 16px;
          border-bottom: 0.5px solid var(--border);
          color: var(--text);
          background: var(--surface2);
        }
        .db-table tr:last-child td { border-bottom: none; }
        .db-table tr:hover td { background: var(--surface3); }
        .db-filename {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text);
        }
        .db-filename svg { color: var(--gold-dim); flex-shrink: 0; }
        .db-chunk-pill {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 20px;
          background: var(--gold-faint);
          border: 0.5px solid var(--border);
          color: var(--gold-dim);
          font-size: 10px;
        }
        .db-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #81C784;
          display: inline-block;
          margin-right: 6px;
          box-shadow: 0 0 5px rgba(76,175,80,0.5);
        }

        /* ── Query log ── */
        .db-log {
          display: flex;
          flex-direction: column;
          gap: 1px;
          border: 0.5px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
        }
        .db-log-row {
          display: grid;
          grid-template-columns: 120px 1fr 80px 70px;
          gap: 12px;
          padding: 10px 16px;
          background: var(--surface2);
          align-items: center;
          transition: background 0.15s;
          font-size: 11px;
        }
        .db-log-row:hover { background: var(--surface3); }
        .db-log-row.header {
          background: var(--surface);
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          font-weight: 400;
          border-bottom: 0.5px solid var(--border);
        }
        .db-log-time { color: var(--text-muted); font-size: 10px; }
        .db-log-query { color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .db-log-ms { color: var(--gold-dim); text-align: right; }
        .db-log-chunks { text-align: right; color: var(--text-muted); }

        /* ── Empty / loading ── */
        .db-empty {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-muted);
          font-size: 12px;
          line-height: 1.7;
        }
        .db-skeleton {
          height: 14px;
          border-radius: 4px;
          background: var(--surface3);
          animation: shimmer 1.4s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        @media (max-width: 640px) {
          .db-content { padding: 16px; }
          .db-log-row { grid-template-columns: 90px 1fr 60px; }
          .db-log-row > *:last-child { display: none; }
        }
      `}</style>

      {/* Topbar */}
      <div className="db-topbar">
        <button className="db-back" onClick={onBack}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
        <span className="db-topbar-title">Dashboard</span>
        <span className="db-topbar-sub">DocMind AI</span>
        <div className="db-topbar-user">
          <div className="db-avatar">{user?.username?.[0]?.toUpperCase() ?? "A"}</div>
          <span className="db-user-name">{user?.username ?? "admin"}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="db-tabs">
        {["overview", "documents", "queries"].map((t) => (
          <button
            key={t}
            className={`db-tab ${activeTab === t ? "active" : ""}`}
            onClick={() => setActiveTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="db-content">
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[1, 2, 3].map(i => <div key={i} className="db-skeleton" style={{ height: 80, borderRadius: 10 }} />)}
          </div>
        ) : (
          <>
            {/* ── Overview tab ── */}
            {activeTab === "overview" && (
              <>
                <div className="db-stat-grid">
                  <StatCard
                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>}
                    label="Documents indexed"
                    value={stats?.total_docs ?? docsToShow.length}
                    sub={`${stats?.total_chunks ?? docsToShow.reduce((s, d) => s + (d.chunks || 0), 0)} total chunks`}
                    trend={12}
                    sparkline={[3, 5, 4, 7, 6, 8, docsToShow.length || 1]}
                  />
                  <StatCard
                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>}
                    label="Queries today"
                    value={stats?.queries_today ?? logs.length}
                    sub="Since midnight"
                    trend={8}
                    sparkline={[2, 6, 4, 9, 7, 11, logs.length || 4]}
                  />
                  <StatCard
                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
                    label="Avg. response"
                    value={stats?.avg_ms ? `${stats.avg_ms}ms` : "1.4s"}
                    sub="Over last 24 h"
                    trend={-5}
                  />
                  <StatCard
                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>}
                    label="System status"
                    value="Online"
                    sub="FastAPI · MongoDB"
                  />
                </div>

                {/* Recent queries preview */}
                <div>
                  <div className="db-section-head">
                    <span className="db-section-title">Recent queries</span>
                    <span className="db-section-badge">{logs.length} entries</span>
                  </div>
                  <QueryLog logs={logs.slice(0, 6)} />
                </div>
              </>
            )}

            {/* ── Documents tab ── */}
            {activeTab === "documents" && (
              <div>
                <div className="db-section-head">
                  <span className="db-section-title">Indexed documents</span>
                  <span className="db-section-badge">{docsToShow.length} files</span>
                </div>
                {docsToShow.length === 0 ? (
                  <div className="db-empty">No documents indexed yet.<br />Upload a PDF from the chat to get started.</div>
                ) : (
                  <div className="db-table-wrap">
                    <table className="db-table">
                      <thead>
                        <tr>
                          <th>Filename</th>
                          <th>Chunks</th>
                          <th>Uploaded</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {docsToShow.map((d, i) => (
                          <tr key={i}>
                            <td>
                              <div className="db-filename">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                  <polyline points="14 2 14 8 20 8" />
                                </svg>
                                {d.filename}
                              </div>
                            </td>
                            <td><span className="db-chunk-pill">{d.chunks ?? "—"}</span></td>
                            <td style={{ color: "var(--text-muted)", fontSize: 10 }}>{d.uploaded_at ?? "just now"}</td>
                            <td><span className="db-status-dot" />indexed</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── Queries tab ── */}
            {activeTab === "queries" && (
              <div>
                <div className="db-section-head">
                  <span className="db-section-title">Query log</span>
                  <span className="db-section-badge">{logs.length} entries</span>
                </div>
                <QueryLog logs={logs} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

async function fetchDashboardData(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`Dashboard request failed (${response.status} ${response.statusText})`);
  }
  return response.json();
}

function isStatsPayload(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (value.docs === undefined ||
      (Array.isArray(value.docs) &&
        value.docs.every((doc) => doc !== null && typeof doc === "object")))
  );
}

function isQueryLogPayload(value) {
  return (
    Array.isArray(value) &&
    value.every((log) => log !== null && typeof log === "object")
  );
}

function QueryLog({ logs }) {
  if (!logs.length) return <div className="db-empty">No queries logged yet.</div>;
  return (
    <div className="db-log">
      <div className="db-log-row header">
        <span>Time</span>
        <span>Query</span>
        <span style={{ textAlign: "right" }}>Latency</span>
        <span style={{ textAlign: "right" }}>Chunks</span>
      </div>
      {logs.map((l, i) => (
        <div className="db-log-row" key={i}>
          <span className="db-log-time">{l.time ?? "—"}</span>
          <span className="db-log-query">{l.query}</span>
          <span className="db-log-ms">{l.ms ?? "—"}ms</span>
          <span className="db-log-chunks">{l.chunks ?? "—"}</span>
        </div>
      ))}
    </div>
  );
}

// ── Mock data (used when backend is offline) ─────────────────────
function mockStats(docs = []) {
  return {
    total_docs: docs.length || 4,
    total_chunks: docs.reduce((s, d) => s + (d.chunks || 0), 0) || 87,
    queries_today: 12,
    avg_ms: 1380,
    docs: docs.length
      ? docs
      : [
        { filename: "q3_report.pdf", chunks: 24, uploaded_at: "today 09:12" },
        { filename: "research_paper.pdf", chunks: 41, uploaded_at: "today 08:30" },
        { filename: "user_manual.pdf", chunks: 22, uploaded_at: "yesterday" },
      ],
  };
}

function mockLogs() {
  const qs = [
    "What are the key findings in chapter 3?",
    "Summarise the executive summary",
    "What is the recommended budget for Q4?",
    "List all authors mentioned",
    "What methodology was used?",
    "What does section 2.4 say about risk?",
  ];
  return qs.map((q, i) => ({
    time: `${(9 + i).toString().padStart(2, "0")}:${(10 + i * 7) % 60}`.replace(/:\d{3}/, (m) => m),
    query: q,
    ms: 900 + Math.floor(Math.random() * 1200),
    chunks: 3 + (i % 3),
  }));
}
