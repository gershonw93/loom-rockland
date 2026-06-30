"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { ELIGIBILITY_CATEGORIES } from "@/lib/eligibility";
import { STATUSES, statusColor } from "@/lib/status";
import { Logo } from "@/components/Logo";
import type { Agent, SubmissionRecord } from "@/lib/types";

const ELIG = new Map(ELIGIBILITY_CATEGORIES.map((c) => [c.value, c.label]));
const PW_KEY = "loom_admin_pw";

type Tab = "dashboard" | "contacts" | "agents";

function startOfToday() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime();
}

export default function AdminPage() {
  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tab, setTab] = useState<Tab>("dashboard");
  const [subs, setSubs] = useState<SubmissionRecord[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [origin, setOrigin] = useState("");

  // contacts filters
  const [statusFilter, setStatusFilter] = useState("");
  const [agentFilter, setAgentFilter] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [newAgent, setNewAgent] = useState("");
  const [copied, setCopied] = useState("");
  const [qrs, setQrs] = useState<Record<string, string>>({});

  useEffect(() => {
    setOrigin(window.location.origin);
    const saved = sessionStorage.getItem(PW_KEY);
    if (saved) {
      setPw(saved);
      setAuthed(true);
    }
  }, []);

  const load = useCallback(async (password: string) => {
    setLoading(true);
    setError(null);
    try {
      const [sRes, aRes] = await Promise.all([
        fetch("/api/admin/submissions", {
          headers: { "x-admin-password": password },
        }),
        fetch("/api/admin/agents", {
          headers: { "x-admin-password": password },
        }),
      ]);
      if (sRes.status === 401) {
        sessionStorage.removeItem(PW_KEY);
        setAuthed(false);
        setError("Incorrect password.");
        return;
      }
      if (!sRes.ok || !aRes.ok) throw new Error("Failed to load data.");
      const sData = await sRes.json();
      const aData = await aRes.json();
      setSubs(sData.submissions ?? []);
      setAgents(aData.agents ?? []);
      sessionStorage.setItem(PW_KEY, password);
      setAuthed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed && pw) load(pw);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  async function changeStatus(id: string, status: string) {
    setSubs((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    try {
      await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: {
          "x-admin-password": pw,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
    } catch {
      setError("Could not save status change.");
    }
  }

  async function addAgent(e: React.FormEvent) {
    e.preventDefault();
    const name = newAgent.trim();
    if (!name) return;
    setError(null);
    try {
      const res = await fetch("/api/admin/agents", {
        method: "POST",
        headers: { "x-admin-password": pw, "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Could not create agent.");
      const data = await res.json();
      setAgents((prev) => [data.agent, ...prev]);
      setNewAgent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create agent.");
    }
  }

  function agentLink(code: string) {
    return `${origin}/apply?ref=${code}`;
  }

  // generate a QR code per agent link
  useEffect(() => {
    if (!origin || agents.length === 0) return;
    let cancelled = false;
    (async () => {
      const map: Record<string, string> = {};
      for (const a of agents) {
        try {
          map[a.code] = await QRCode.toDataURL(`${origin}/apply?ref=${a.code}`, {
            width: 480,
            margin: 1,
            color: { dark: "#2e1a47", light: "#ffffff" },
          });
        } catch {
          /* ignore */
        }
      }
      if (!cancelled) setQrs(map);
    })();
    return () => {
      cancelled = true;
    };
  }, [agents, origin]);

  function downloadQr(code: string, name: string) {
    const url = qrs[code];
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `loom-rockland-qr-${name.replace(/\s+/g, "-").toLowerCase()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  async function copyLink(code: string) {
    try {
      await navigator.clipboard.writeText(agentLink(code));
      setCopied(code);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      /* ignore */
    }
  }

  function exportCsv() {
    const fromISO = from ? new Date(`${from}T00:00:00`).toISOString() : "";
    const toISO = to ? new Date(`${to}T23:59:59.999`).toISOString() : "";
    const qs = new URLSearchParams();
    if (fromISO) qs.set("from", fromISO);
    if (toISO) qs.set("to", toISO);
    qs.set("label", from || to ? `${from || "start"}_to_${to || "now"}` : "all");
    fetch(`/api/admin/export?${qs.toString()}`, {
      headers: { "x-admin-password": pw },
    })
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `loom-rockland-enrollments-${from || "all"}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      });
  }

  function logout() {
    sessionStorage.removeItem(PW_KEY);
    setAuthed(false);
    setPw("");
    setSubs([]);
    setAgents([]);
  }

  // ── derived ───────────────────────────────────────────────────
  const stats = useMemo(() => {
    const t0 = startOfToday();
    const week = t0 - 6 * 86400000;
    let today = 0;
    let wk = 0;
    let approved = 0;
    for (const s of subs) {
      const t = new Date(s.createdAt).getTime();
      if (t >= t0) today++;
      if (t >= week) wk++;
      if (s.status === "approved") approved++;
    }
    return { today, week: wk, total: subs.length, approved };
  }, [subs]);

  const leaderboard = useMemo(() => {
    const t0 = startOfToday();
    const map = new Map<
      string,
      { key: string; name: string; total: number; today: number; approved: number }
    >();
    // seed with all agents so 0-referral agents still show
    for (const a of agents) {
      map.set(a.code, { key: a.code, name: a.name, total: 0, today: 0, approved: 0 });
    }
    for (const s of subs) {
      const key = s.agentCode || "__direct";
      const name =
        s.agentName || (s.agentCode ? s.agentCode : "Direct / no agent");
      const e =
        map.get(key) || { key, name, total: 0, today: 0, approved: 0 };
      e.total++;
      if (new Date(s.createdAt).getTime() >= t0) e.today++;
      if (s.status === "approved") e.approved++;
      map.set(key, e);
    }
    return [...map.values()].sort((a, b) => b.total - a.total);
  }, [subs, agents]);

  const maxLb = Math.max(1, ...leaderboard.map((l) => l.total));

  const filtered = useMemo(() => {
    const fromTs = from ? new Date(`${from}T00:00:00`).getTime() : null;
    const toTs = to ? new Date(`${to}T23:59:59.999`).getTime() : null;
    return subs.filter((s) => {
      if (statusFilter && s.status !== statusFilter) return false;
      if (agentFilter && (s.agentCode || "__direct") !== agentFilter) return false;
      const t = new Date(s.createdAt).getTime();
      if (fromTs && t < fromTs) return false;
      if (toTs && t > toTs) return false;
      return true;
    });
  }, [subs, statusFilter, agentFilter, from, to]);

  const agentCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of subs) m.set(s.agentCode, (m.get(s.agentCode) || 0) + 1);
    return m;
  }, [subs]);

  // ── login ─────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="admin-wrap">
        <div className="card login-card">
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <Logo variant="full" height={46} />
          </div>
          <h2 style={{ textAlign: "center", marginTop: 0 }}>Admin sign in</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              load(pw);
            }}
          >
            <div className="field">
              <label htmlFor="pw">Admin password</label>
              <input
                id="pw"
                type="password"
                value={pw}
                autoFocus
                onChange={(e) => setPw(e.target.value)}
              />
            </div>
            {error && <div className="alert error">{error}</div>}
            <div style={{ marginTop: 18 }}>
              <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ── dashboard ─────────────────────────────────────────────────
  return (
    <div className="admin-wrap">
      <div className="admin-top">
        <div>
          <Logo variant="mark" height={26} />
          <h1>LOOM Rockland — Admin</h1>
        </div>
        <button className="btn-ghost" onClick={logout} style={{ padding: "9px 18px" }}>
          Sign out
        </button>
      </div>

      <div className="tabs">
        {(["dashboard", "contacts", "agents"] as Tab[]).map((t) => (
          <button
            key={t}
            className={`tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "dashboard" ? "Dashboard" : t === "contacts" ? "Contacts" : "Agents"}
          </button>
        ))}
      </div>

      {error && <div className="alert error">{error}</div>}

      {/* ── DASHBOARD ── */}
      {tab === "dashboard" && (
        <>
          <div className="stats">
            <div className="stat accent">
              <div className="n">{stats.today}</div>
              <div className="l">Submitted today</div>
            </div>
            <div className="stat">
              <div className="n">{stats.week}</div>
              <div className="l">Last 7 days</div>
            </div>
            <div className="stat">
              <div className="n">{stats.total}</div>
              <div className="l">Total submissions</div>
            </div>
            <div className="stat">
              <div className="n">{stats.approved}</div>
              <div className="l">Approved</div>
            </div>
          </div>

          <div className="card">
            <div className="admin-h2">Referrals by agent</div>
            <div className="table-wrap" style={{ boxShadow: "none", border: "none" }}>
              <table>
                <thead>
                  <tr>
                    <th>Agent</th>
                    <th style={{ width: "40%" }}>Referrals</th>
                    <th>Total</th>
                    <th>Today</th>
                    <th>Approved</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="empty">
                        No submissions yet.
                      </td>
                    </tr>
                  ) : (
                    leaderboard.map((l) => (
                      <tr key={l.key} className={l.total === 0 ? "muted-row" : ""}>
                        <td style={{ fontWeight: 600 }}>{l.name}</td>
                        <td>
                          <div
                            className="lb-bar"
                            style={{ width: `${(l.total / maxLb) * 100}%` }}
                          />
                        </td>
                        <td>{l.total}</td>
                        <td>{l.today}</td>
                        <td>{l.approved}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── CONTACTS ── */}
      {tab === "contacts" && (
        <>
          <div className="card" style={{ marginBottom: 18 }}>
            <div className="admin-bar" style={{ marginBottom: 0 }}>
              <div className="admin-filters">
                <div className="field">
                  <label>Status</label>
                  <select
                    className="status-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All statuses</option>
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Agent</label>
                  <select
                    className="status-select"
                    value={agentFilter}
                    onChange={(e) => setAgentFilter(e.target.value)}
                  >
                    <option value="">All agents</option>
                    <option value="__direct">Direct / no agent</option>
                    {agents.map((a) => (
                      <option key={a.code} value={a.code}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>From date</label>
                  <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                </div>
                <div className="field">
                  <label>To date</label>
                  <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                </div>
                <button
                  className="btn-ghost"
                  style={{ padding: "10px 16px" }}
                  onClick={() => {
                    setStatusFilter("");
                    setAgentFilter("");
                    setFrom("");
                    setTo("");
                  }}
                >
                  Clear
                </button>
              </div>
              <button
                className="btn btn-primary"
                style={{ padding: "11px 20px" }}
                onClick={exportCsv}
                disabled={filtered.length === 0}
              >
                ⬇ Export CSV ({filtered.length})
              </button>
            </div>
          </div>

          <div className="table-wrap">
            {filtered.length === 0 ? (
              <div className="empty">{loading ? "Loading…" : "No matching contacts."}</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Agent</th>
                    <th>Signed up with</th>
                    <th>Family</th>
                    <th>CINs</th>
                    <th>Photos</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <select
                          className="status-select"
                          value={r.status}
                          style={{ borderColor: statusColor(r.status) }}
                          onChange={(e) => changeStatus(r.id, e.target.value)}
                        >
                          {STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        {r.createdAt ? new Date(r.createdAt).toLocaleString("en-US") : "—"}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {r.firstName} {r.lastName}
                        <div style={{ fontWeight: 400, color: "var(--muted)", fontSize: 12 }}>
                          DOB {r.dateOfBirth}
                        </div>
                      </td>
                      <td>{r.phone}</td>
                      <td>{r.agentName || "—"}</td>
                      <td style={{ whiteSpace: "normal", minWidth: 220 }}>
                        {r.eligibility.map((e) => (
                          <span className="pill" key={e}>
                            {(ELIG.get(e) ?? e).split(" – ")[0]}
                          </span>
                        ))}
                      </td>
                      <td>{r.familyMembers}</td>
                      <td>{r.medicaidIds.join(", ") || "—"}</td>
                      <td>{r.photos.length || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <p className="footer">
            Change a contact&apos;s Status inline. Photo links are included as
            secure, time-limited URLs in the CSV export.
          </p>
        </>
      )}

      {/* ── AGENTS ── */}
      {tab === "agents" && (
        <>
          <div className="card" style={{ marginBottom: 18 }}>
            <div className="admin-h2">Add an agent</div>
            <form className="add-agent" onSubmit={addAgent}>
              <input
                type="text"
                placeholder="Agent's full name (e.g. Motty Steinmetz)"
                value={newAgent}
                onChange={(e) => setNewAgent(e.target.value)}
              />
              <button className="btn btn-primary" type="submit" style={{ padding: "12px 22px" }}>
                + Create agent &amp; link
              </button>
            </form>
            <p className="footer" style={{ margin: 0, textAlign: "left" }}>
              Each agent gets a unique link. Every application opened from that
              link is automatically credited to them.
            </p>
          </div>

          {agents.length === 0 ? (
            <div className="empty">No agents yet — add your first one above.</div>
          ) : (
            <div className="agent-grid">
              {agents.map((a) => (
                <div className="agent-card" key={a.code}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="name">{a.name}</span>
                    <span className="count">{agentCounts.get(a.code) || 0} referrals</span>
                  </div>
                  <div className="agent-link">
                    <input readOnly value={agentLink(a.code)} onFocus={(e) => e.target.select()} />
                    <button
                      className={`copy-btn ${copied === a.code ? "copied" : ""}`}
                      onClick={() => copyLink(a.code)}
                    >
                      {copied === a.code ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  {qrs[a.code] && (
                    <div className="agent-qr">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qrs[a.code]} alt={`QR code for ${a.name}`} />
                      <button className="btn-ghost" onClick={() => downloadQr(a.code, a.name)}>
                        ⬇ Download QR
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
