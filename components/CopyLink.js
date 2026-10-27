"use client";
import { useState } from "react";
export default function CopyLink() {
  const [done, setDone] = useState(false);
  return (
    <button className="btn ghost" onClick={async () => { await navigator.clipboard.writeText(window.location.href); setDone(true); setTimeout(() => setDone(false), 2000); }}>
      {done ? "Link copied" : "Copy share link"}
    </button>
  );
}
