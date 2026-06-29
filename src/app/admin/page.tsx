"use client";

import { useCallback, useEffect, useState } from "react";
import { ELIGIBILITY_CATEGORIES } from "@/lib/eligibility";
import { LoomMark } from "@/components/LoomMark";
import type { SubmissionRecord } from "@/lib/types";

const LABELS = new Map(ELIGIBILITY_CATEGORIES.map((c) => [c.value, c.label]));
const PW_KEY = "loom_admin_pw";

function todayInput(): string {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

/** Convert YYYY-MM-DD date inputs into local-time ISO range boundaries. */
function rangeToISO(from: string, to: string) {
  const fromISO = from ? new Date(`${from}T00:00:00`).toISOString() : "";
  const toISO = to ? new Date(`${to}T23:59:59.999`).toISOString() : "";
  return { fromISO, toISO };
}

export default function AdminPage() {
  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);
  const [from, setFrom] = useState(todayInput());
  const [to, setTo] = useState(todayInput());
  const [rows, setRows] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(PW_KEY);
    if (saved) {
      setPw(saved);
      setAuthed(true);
    }
  }, []);

  const load = useCallback(
    async (password: string, f: string, t: string) => {
      setLoading(true);
      setError(null);
      const { fromISO, toISO } = rangeToISO(f, t);
      const qs = new URLSearchParams();
      if (fromISO) qs.set("from", fromISO);
      if (toISO) qs.set("to", toISO);
      try {
        const res = await fetch(`/api/admin/submissions?${qs.toString()}`, {
          headers: { "x-admin-password": password },
        });
        if (res.status === 401) {
          sessionStorage.removeItem(PW_KEY);
          setAuthed(false);
          setError("Incorrect password.");
          return;
        }
        if (!res.ok) throw new Error("Failed to load submissions.");
        const data = await res.json();
        setRows(data.submissions ?? []);
        sessionStorage.setItem(PW_KEY, password);
        setAuthed(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading data.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (authed && pw) load(pw, from, to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  async function exportCsv() {
    setError(null);
    const { fromISO, toISO } = rangeToISO(from, to);
    const qs = new URLSearchParams();
    if (fromISO) qs.set("from", fromISO);
    if (toISO) qs.set("to", toISO);
    qs.set("label", from === to ? from : `${from}_to_${to}`);
    try {
      const res = await fetch(`/api/admin/export?${qs.toString()}`, {
        headers: { "x-admin-password": pw },
      });
      if (!res.ok) throw new Error("Export failed.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        from === to
          ? `loom-rockland-enrollments-${from}.csv`
          : `loom-rockland-enrollments-${from}_to_${to}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    }
  }

  function logout() {
    sessionStorage.removeItem(PW_KEY);
    setAuthed(false);
    setPw("");
    setRows([]);
  }

  // ── Login ─────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="admin-wrap">
        <div className="card login-card">
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <LoomMark size={22} />
          </div>
          <h2 style={{ textAlign: "center", marginTop: 0 }}>Admin sign in</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              load(pw, from, to);
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
              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────
  return (
    <div className="admin-wrap">
      <div className="admin-bar">
        <div>
          <LoomMark size={20} />
          <h2 style={{ margin: "10px 0 0" }}>Enrollment submissions</h2>
        </div>
        <button className="btn-ghost" onClick={logout}>
          Sign out
        </button>
      </div>

      <div className="card">
        <div className="admin-bar" style={{ marginBottom: 0 }}>
          <div className="admin-filters">
            <div className="field">
              <label htmlFor="from">From date</label>
              <input
                id="from"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="to">To date</label>
              <input
                id="to"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <button
              className="btn-ghost"
              onClick={() => load(pw, from, to)}
              disabled={loading}
            >
              {loading ? "Loading…" : "Apply"}
            </button>
            <button
              className="btn-ghost"
              onClick={() => {
                setFrom("");
                setTo("");
                load(pw, "", "");
              }}
            >
              Show all
            </button>
          </div>
          <button
            className="btn-primary"
            style={{ width: "auto" }}
            onClick={exportCsv}
            disabled={rows.length === 0}
          >
            ⬇ Export CSV ({rows.length})
          </button>
        </div>
        {error && <div className="alert error">{error}</div>}
      </div>

      <div className="table-wrap" style={{ marginTop: 18 }}>
        {rows.length === 0 ? (
          <div className="empty">
            {loading ? "Loading…" : "No submissions for this date range."}
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Submitted</th>
                <th>Name</th>
                <th>DOB</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Referred by</th>
                <th>Eligibility</th>
                <th>Family</th>
                <th>CINs</th>
                <th>Photos</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleString("en-US")
                      : "—"}
                  </td>
                  <td>
                    {r.firstName} {r.lastName}
                  </td>
                  <td>{r.dateOfBirth}</td>
                  <td>{r.phone}</td>
                  <td style={{ whiteSpace: "normal", minWidth: 200 }}>
                    {[r.address.line1, r.address.line2, r.address.city, r.address.state, r.address.zip]
                      .filter(Boolean)
                      .join(", ")}
                  </td>
                  <td>{r.referredBy}</td>
                  <td style={{ whiteSpace: "normal", minWidth: 220 }}>
                    {r.eligibility.map((e) => (
                      <span className="pill" key={e}>
                        {(LABELS.get(e) ?? e).split(" – ")[0]}
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
        Photo links are included as secure, time-limited URLs in the CSV export.
      </p>
    </div>
  );
}
