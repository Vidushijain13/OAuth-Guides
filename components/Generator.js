"use client";
import { useState } from "react";
import { encodeGuide } from "@/lib/encode";

export default function Generator() {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function go(e) {
    e.preventDefault();
    if (!q.trim() || busy) return;
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: q }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Something went wrong.");
      window.location.href = "/g#" + encodeGuide(d.guide);
    } catch (e2) { setErr(e2.message); setBusy(false); }
  }
  return (
    <form onSubmit={go} className="gen">
      <label htmlFor="q">Not in the library? Name an app or paste its website.</label>
      <div className="genrow">
        <input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Notion, or https://www.zoom.us" disabled={busy} />
        <button className="btn" disabled={busy}>{busy ? "Reading docs…" : "Generate guide"}</button>
      </div>
      {busy && <p className="hint">Finding the provider&apos;s developer docs and reading them. This takes 20 to 60 seconds.</p>}
      {err && <p className="err" role="alert">{err}</p>}
    </form>
  );
}
