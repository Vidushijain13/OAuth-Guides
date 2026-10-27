// Live guide generation: (1) identify the app and its official docs, (2) fetch those pages,
// (3) write the guide from ONLY those pages, (4) downgrade any claim whose source we did not actually read.
const MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
export class UserError extends Error {}

async function gemini(prompt) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new UserError("GEMINI_API_KEY is not set on the server. Add it to .env.local (or Vercel env vars).");
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
    }),
  });
  if (r.status === 429) throw new UserError("The free Gemini quota is used up for now. Try again in a few minutes, or open a guide from the library.");
  if (!r.ok) throw new UserError(`Gemini returned ${r.status}. Check that GEMINI_MODEL is a current model ID from AI Studio.`);
  const d = await r.json();
  const t = (d.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");
  try { return JSON.parse(t.replace(/^```json\s*|```$/g, "").trim()); }
  catch { throw new UserError("The model returned an unreadable answer. Please try again."); }
}

function safe(u) {
  try {
    const x = new URL(u); const h = x.hostname;
    return x.protocol === "https:" && !(h === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(h) || h.endsWith(".local") || h.endsWith(".internal") || h.includes(":"));
  } catch { return false; }
}

async function fetchPage(url) {
  if (!safe(url)) return null;
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(8000), redirect: "follow", headers: { "User-Agent": "oauth-guides-bot/0.1" } });
    if (!r.ok) return null;
    const ct = r.headers.get("content-type") || "";
    if (!ct.includes("text/html") && !ct.includes("text/plain")) return null;
    const html = (await r.text()).slice(0, 400000);
    const text = html.replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;|&amp;|&#\d+;/g, " ").replace(/\s+/g, " ").trim().slice(0, 7000);
    if (text.length < 300) return null; // JS-only docs sites come back empty; we skip them rather than guess
    return { url, finalUrl: r.url || url, text };
  } catch { return null; }
}

const SCHEMA = `{
 "app": string, "website": string, "category": string, "summary": "one sentence a developer can act on",
 "verdict": { "level": "instant"|"hours"|"days"|"weeks"|"uncertain", "label": "e.g. 'Self-serve, ~30 min' or 'Verification: weeks'",
   "approval_required": true|false|null, "effort": "developer time, e.g. '1-2 hours'", "wait": "provider wait, e.g. 'none' or '2-6 weeks'",
   "reason": "why, in 1-2 sentences", "evidence": "sourced"|"unverified", "source_url": string|null },
 "steps": [ { "title": string, "detail": string, "who": "agent"|"you"|"either", "evidence": "sourced"|"unverified", "source_url": string|null } ],
 "blockers": [ { "title": string, "detail": string, "what_to_do": "how to proceed or get unstuck", "evidence": "sourced"|"unverified", "source_url": string|null } ],
 "agent_vs_you": { "agent_can": [string], "you_must": [string] },
 "checks_to_run": [ "things a human should verify before relying on this guide" ]
}`;

export async function generateGuide(query) {
  const id = await gemini(`A developer wants to set up an OAuth app with this provider: "${query}" (it may be a name or a website).
Return JSON: {"name": official product name, "website": homepage URL, "docs_urls": [up to 5 https URLs of OFFICIAL developer documentation pages about registering an OAuth app, scopes/permissions, and app review or verification]}.
Use only the provider's own domains. If you are unsure of an exact path, give the best-known page.`);
  const pages = (await Promise.all((id.docs_urls || []).slice(0, 5).map(fetchPage))).filter(Boolean);
  const ok = new Set(pages.flatMap((p) => [p.url, p.finalUrl]));
  const docs = pages.map((p) => `SOURCE ${p.finalUrl}\n${p.text}`).join("\n\n---\n\n") || "(no documentation pages could be read)";

  const g = await gemini(`You write OAuth-app setup guides for developers building AI agents whose users will connect "${id.name || query}".
Use ONLY the documentation below. Rules:
- Mark a claim "sourced" and set source_url to the exact SOURCE url ONLY if that page states it. Anything from your own background knowledge, or not stated, must be "unverified" with source_url null.
- Never claim you tested anything. Do not invent URLs, fees, timelines or review rules. If the docs do not say how long approval takes, say so in "wait" and use level "uncertain" if you cannot tell.
- Steps in order, each short and concrete. Mark who does each: "agent" only for things an agent can really do (reading docs, drafting scope justifications, filling in config, checking redirect URL format); "you" for account login, identity/business verification, payments, policy acceptance, submitting review forms.
- 4-8 steps, 2-4 blockers, simple plain language.
Return JSON in exactly this shape: ${SCHEMA}

DOCUMENTATION:
${docs}`);

  // Code, not the model, decides what counts as "sourced": the cited page must be one we actually read.
  const fix = (o) => {
    if (!o || typeof o !== "object") return o;
    if (o.evidence === "sourced" && ok.has(o.source_url)) return o;
    o.evidence = "unverified"; o.source_url = null; return o;
  };
  g.verdict = fix(g.verdict || {});
  g.steps = (g.steps || []).map(fix);
  g.blockers = (g.blockers || []).map(fix);
  g.slug = String(g.app || query).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  g.sources = pages.map((p) => ({ url: p.finalUrl, title: p.finalUrl }));
  g.verification = { status: "unverified", log: [], checks_to_run: g.checks_to_run || [] };
  g.generated = { live: true, model: MODEL, at: new Date().toISOString().slice(0, 10), pages_read: pages.length, pages_tried: (id.docs_urls || []).length };
  delete g.checks_to_run;
  return g;
}
