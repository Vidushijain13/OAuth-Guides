# OAuth setup guides for agent builders

Know what an OAuth app will cost you before you launch an integration.

- **Live website:** https://oauth-guides-seven.vercel.app
- **Demo video:** ATTACH-LOOM-LINK-HERE
- **Research and testing summary:** [RESEARCH.md](./RESEARCH.md)

## The problem

Before an agent can connect to a user's app, the developer often has to create an OAuth app with the provider and sometimes get it approved. Today it is hard to tell whether that takes 30 minutes or several weeks, what could block approval, and which steps an agent can do for you.

## What it does

- **Guide library.** Guides for GitHub, Google (Gmail), LinkedIn and Slack. Each guide shows a one-line verdict, the effort and wait, ordered steps, blockers, and a split of what an agent can do versus what you must do. The four apps were chosen because each has a different setup challenge: self-serve (GitHub), verification that takes weeks (Gmail), partner approval (LinkedIn), and self-serve to start with a separate review to be listed (Slack).
- **Live generation.** Enter an app name or website. The app tries to read that provider's public documentation pages and uses the Gemini API to draft a guide in the same format as the library guides. The guide records the date, the model, and how many of the documentation pages it tried to read it could actually read.
- **Evidence labels on every claim.** Each step, blocker and verdict is tagged Tested, Sourced or Unverified. Each guide has a "How much to trust this guide" section with a dated log of what was checked, what is still to check, and links to the sources.

## Key decisions

- **Evidence over polish.** Guides written from a model's general knowledge had errors in all three guides I checked, so every claim carries a label and a source link instead of sounding equally confident.
- **The approval wait is the headline.** The real cost for a developer is usually the approval wait, not the form, so each card leads with a one-line verdict such as "Self-serve, about 30 min" or "Verification needed: weeks".
- **Agent versus you on every step.** Providers need a person to sign in, accept terms and submit reviews, so each step says who does it: you, the agent, or either.
- **Live guides are always Unverified.** Nobody has checked a guide generated in real time, and the page says so.
- **Guides are plain JSON files.** Each guide is one file in `data/guides/`, so a guide can be read, corrected and reviewed like any other source file.

## Technology

Next.js, the Gemini API, and Vercel for hosting.

```
app/            pages and API routes
components/     GuideView.js renders a guide
data/guides/    one JSON file per library guide
lib/            helpers
```

## Run locally

```bash
git clone https://github.com/Vidushijain13/OAuth-Guides.git
cd OAuth-Guides
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000.

On Windows PowerShell, use `copy .env.example .env.local` instead of `cp`.

In `.env.local`, set:

| Variable | Value |
| --- | --- |
| `GEMINI_API_KEY` | Your own key from Google AI Studio |
| `GEMINI_MODEL` | A current model ID from Google AI Studio |

Library guides work without a key. Only live generation needs one. No credentials are committed to this repository.

## Deploy

Import the repository into Vercel, add the same two environment variables, and deploy. Redeploy after changing a variable, because variables apply only to new deployments.

## Limitations

- The library has four guides, not 100.
- The agent reads documentation. It does not create OAuth apps in provider consoles or complete approvals.
- Guides were checked against official documentation on 2026-10-28 and can go stale as providers change their requirements.
- LinkedIn is Unverified. GitHub, Gmail and Slack are Sourced. No guide is Tested, because no setup was attempted.
- Live guides are Unverified and can contain mistakes.
- Gemini sometimes returns a temporary 503 error. The page then shows an error message and the developer can try again.

See [RESEARCH.md](./RESEARCH.md) for what was checked, what was corrected and what could not be verified.
