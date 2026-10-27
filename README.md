# OAuth setup guides for agent builders

A developer looks up an app (or types any app name or website) and gets a guide that says:
how hard it is, how long it takes, whether the provider must approve them, what can block them,
and which steps an agent can do versus which they must do themselves.

Live link: _add your Vercel URL here_

## Run it

1. `npm install`
2. Get a free key from Google AI Studio. Copy `.env.example` to `.env.local` and fill in `GEMINI_API_KEY`
   and `GEMINI_MODEL` (copy the exact model ID from AI Studio).
3. `npm run dev`, open http://localhost:3000

On Vercel, add the same two values under Project Settings, Environment Variables. Never commit `.env.local`.

## What is in it

- **Library:** 4 hand-checked-in guides in `data/guides/*.json` (GitHub, Slack, Google Gmail, LinkedIn),
  chosen because their setup difficulty is very different (minutes to weeks).
- **Live generation:** `/api/generate` runs an agent that (1) identifies the app and its official docs,
  (2) fetches those pages, (3) writes the guide using only what it read, (4) checks its own claims.
- **Sharing:** a generated guide is shared as a link that carries the guide in the URL hash. No database.

## Key decisions

1. **Every claim carries an evidence label: Tested, Sourced or Unverified.** The brief asks for honesty about
   evidence, so this is part of the product, not just the README.
2. **Code decides what counts as "Sourced", not the model.** A claim is only Sourced if the model cites a page
   the server actually fetched. Anything else is downgraded to Unverified. Live guides can never be "Tested".
3. **The top of every guide is a verdict:** time band, approval needed, your effort, provider wait.
   A developer's first question is "is this an hour or a month?".
4. **Agent vs you is explicit per step.** Logging in, identity or business verification, payments and review
   forms always stay with the human.
5. **Unknown is a valid answer.** If the docs don't state a timeline, the guide says so.

## Verification log (fill this in as you test)

| Guide | What I checked | What I found | Changed in guide? |
|---|---|---|---|
| GitHub | | | |
| Slack | | | |
| Google (Gmail) | | | |
| LinkedIn | | | |
| Live: _app name_ | | | |

Record results in each guide's `verification.log` and change `evidence` to `tested` or `sourced` only for
claims you actually tested or confirmed on an official page.

## Limitations

- Library guides were drafted from general knowledge and start as Unverified until checked.
- Docs sites that need JavaScript to render can't be read by the simple fetcher, so some apps get thin guides.
- The agent cannot create real OAuth apps or log in to providers, so it never produces "Tested" claims.
- Free Gemini quota is small. Repeat requests are cached per server instance only.
- Provider rules change. Each guide shows its date.
