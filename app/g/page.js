"use client";
import { useEffect, useState } from "react";
import GuideView from "@/components/GuideView";
import CopyLink from "@/components/CopyLink";
import { decodeGuide } from "@/lib/encode";

export default function Live() {
  const [g, setG] = useState(null);
  const [bad, setBad] = useState(false);
  useEffect(() => {
    const load = () => { try { setG(decodeGuide(window.location.hash.slice(1))); setBad(false); } catch { setBad(true); } };
    load(); window.addEventListener("hashchange", load);
    return () => window.removeEventListener("hashchange", load);
  }, []);
  if (bad) return <p className="err">This link doesn&apos;t contain a guide. <a href="/">Generate one</a>.</p>;
  if (!g) return <p className="hint">Loading guide…</p>;
  return (<><div className="bar"><a href="/">← All guides</a><CopyLink /></div><GuideView g={g} /></>);
}
