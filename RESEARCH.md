# Research and testing summary

Checks done on 2026-10-28.

## Method

An AI research agent fetched and read the official documentation pages listed below and compared each page with the matching library guide, claim by claim. Each correction was applied to the guide's data file and recorded in that guide's "What was checked" log, which is visible on the live page.

No OAuth app was created in any provider console and no approval was attempted, so no guide is marked Tested.

## Findings by guide

| Guide | Status | What was corrected | Could not verify |
| --- | --- | --- | --- |
| GitHub | Sourced | Removed localhost and HTTPS advice that the docs do not cover. Replaced "request access from the consent screen" with the org-owner approval path the docs describe. Softened the claim that only GitHub Apps get short-lived tokens, because the current create-app page offers expiring user tokens for OAuth apps too. | Client secret step, "no review by GitHub", the 20 to 40 minute estimate, the org approval screen |
| Google (Gmail) | Sourced | "Gmail scopes are restricted" was too broad: gmail.send is only sensitive. Removed "has a cost" for the security assessment, since the pages state no cost. Corrected the advice to avoid storing mail, because the rule also covers transmitting restricted data. Added the 7-day refresh token expiry in testing mode and the real submission steps. | Cloud project and client creation, security assessment cost and duration, the Sensitive scope verification page (could not be fetched) |
| Slack | Sourced | Marketplace review was "days to weeks", but Slack publishes up to 10 business days plus up to 10 weeks for new apps. Added the requirement of 10 or more active workspaces. Removed a privacy policy and support page claim that the review guide does not state. Removed "many workspaces require admin approval". | The Create New App dashboard flow, where tokens appear, the 1 to 3 hour estimate |
| LinkedIn | Unverified | Not checked | Everything |

## What the agent does and does not do

- **Does:** reads public documentation and drafts a guide with sources, a time and effort estimate, blockers, and the steps an agent can help with.
- **Does not:** sign in to providers, create OAuth apps, submit reviews or pass approvals.
- **Live guides:** generated from public pages in real time and not checked by a person. The page shows how many documentation pages the agent read out of those it tried.

## What I learned

- Approval, not setup, is the real time cost. GitHub takes minutes. Gmail restricted scopes and the Slack Marketplace take weeks.
- Small details change the answer. gmail.send avoids the security assessment that gmail.readonly triggers, and the Slack Marketplace needs 10 active installs before you can apply.
- Drafts written from general knowledge had errors in all three guides checked, which is why each claim carries an evidence label.

## Known limitations and uncertainty

- Review timelines are Slack's and Google's published estimates, not measured.
- The GitHub Apps versus OAuth apps page that was read is the Enterprise Server 3.9 version, not the current cloud docs.
- Documentation changes, so these guides can go stale.
- Next steps: create real apps to move claims to Tested, re-check on a schedule, and let the agent attempt setup in a sandbox.

## Sources

Pages opened and read on 2026-10-28.

**GitHub**

- [Creating an OAuth app](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
- [Approving OAuth apps for your organization](https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/approving-oauth-apps-for-your-organization)
- [Authorizing OAuth apps](https://docs.github.com/en/apps/oauth-apps/using-oauth-apps/authorizing-oauth-apps)
- [Differences between GitHub Apps and OAuth apps (Enterprise Server 3.9)](https://docs.github.com/en/enterprise-server@3.9/apps/oauth-apps/building-oauth-apps/differences-between-github-apps-and-oauth-apps)

**Google**

- [Restricted scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification)
- [Gmail API scopes](https://developers.google.com/workspace/gmail/api/auth/scopes)
- [OAuth app verification overview](https://developers.google.com/identity/protocols/oauth2/production-readiness/overview)
- [Security assessment](https://support.google.com/cloud/answer/13465431)
- [Verification requirements](https://support.google.com/cloud/answer/13464321)

**Slack**

- [Installing with OAuth](https://docs.slack.dev/authentication/installing-with-oauth/)
- [App distribution](https://docs.slack.dev/app-management/distribution/)
- [Marketplace review guide](https://docs.slack.dev/slack-marketplace/slack-marketplace-review-guide)
- [Managing app approvals](https://docs.slack.dev/admins/managing-app-approvals)
