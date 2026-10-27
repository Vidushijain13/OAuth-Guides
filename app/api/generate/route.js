import { generateGuide, UserError } from "@/lib/generate";
export const maxDuration = 60;
const cache = new Map(); // per server instance; saves quota on repeat requests

export async function POST(req) {
  try {
    const { query } = await req.json();
    const q = String(query || "").trim().slice(0, 120);
    if (q.length < 2) return Response.json({ error: "Enter an app name or website." }, { status: 400 });
    const k = q.toLowerCase();
    if (!cache.has(k)) cache.set(k, await generateGuide(q));
    return Response.json({ guide: cache.get(k) });
  } catch (e) {
    const msg = e instanceof UserError ? e.message : "Could not generate this guide. Please try again.";
    return Response.json({ error: msg }, { status: e instanceof UserError ? 422 : 500 });
  }
}
