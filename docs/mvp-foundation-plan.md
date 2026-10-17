# ArquitectoLegalRD MVP — Foundation Plan

**Status:** APPROVED FOR IMPLEMENTATION PLANNING  
**Working branch:** `feat/arquitectolegalrd-mvp-foundation`  
**Protected baseline:** `main` remains unchanged by this work.  
**Scope:** Establish a verifiable web application foundation for the MVP without modifying production deployments or borrowing code blindly from other repositories.

## Evidence-based baseline

- The default branch of this repository currently contains agent/skill documentation and a minimal README; it does not contain a runnable web application or a `package.json`.
- The `law-firm-website` repository contains a Next.js/React UI for a law firm, but no verified Supabase authentication, OpenAI integration, or persisted legal chat history. Treat it as a UI reference, not a backend.
- The `abogado809` repository contains a small Next.js 13.5.6 / React 18.2.0 app and a homepage smoke test. Its current implementation has not been proven to satisfy this MVP and its dependencies need a security/compatibility review.
- `ocoa-legal-web` currently reports an empty Git repository.
- Existing Vercel deployments are not to be changed or deleted as part of this foundation work.

## MVP acceptance path

1. A visitor can register and sign in.
2. Server-side identity is verified before protected operations.
3. An authenticated user submits a Dominican-law question.
4. A server-only route calls the OpenAI API; no API key is exposed to the browser.
5. The response and relevant metadata are persisted as a history item owned by that user.
6. The user can retrieve only their own history.
7. Build and automated smoke tests pass, and the deployed preview URL is checked.

Legal responses must distinguish general information from legal analysis, avoid claiming unsupported legal authority, and preserve source/provenance metadata when sources are available. The MVP must not present generated output as a verified professional legal opinion.

## Proposed foundation files

- `package.json`: supported scripts and explicit dependencies.
- `app/layout.tsx`, `app/globals.css`, `app/page.tsx`: responsive application shell and landing/dashboard entry.
- `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`: authentication screens.
- `app/(app)/chat/page.tsx`, `app/(app)/history/page.tsx`: protected chat and history UI.
- `app/api/chat/route.ts`: authenticated, server-only OpenAI request and persistence.
- `lib/supabase/client.ts`, `lib/supabase/server.ts`: browser/server Supabase clients using `@supabase/ssr`.
- `proxy.ts` (or the version-appropriate Next.js request-interception file): refresh SSR auth cookies where required; confirm against the selected Next.js version before implementation.
- `lib/auth/require-user.ts`: shared server-side identity guard.
- `lib/openai.ts`: server-only OpenAI client.
- `supabase/migrations/001_legal_history.sql`: history table and row-level security policies.
- `.env.example`: variable names and placeholders only; never real credentials.
- `README.md`: setup, required environment variables, migration, testing and deployment steps.
- `tests/smoke` or `scripts/smoke-test.mjs`: homepage/health checks and, where test infrastructure permits, critical auth/chat flow checks.

This list is a proposed target, not a claim that the files already exist. Adapt paths to the chosen Next.js version and official Supabase SSR guidance.

## Security and environment requirements

- Required values are configured through local environment variables and Vercel project settings, never committed to Git.
- Expected variable names: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or current publishable key), and `OPENAI_API_KEY`. Use the key name supported by the selected Supabase project; do not print or log any values.
- OpenAI calls occur only on the server. Validate request shape and size, handle rate limits and provider errors, and avoid logging sensitive legal questions unnecessarily.
- Apply PostgreSQL RLS so authenticated users can read/write only rows associated with their verified user ID. Never trust a user ID submitted by the browser.
- Use the Supabase SSR cookie pattern and verify identity server-side (for example, `getClaims()` according to current official guidance); do not authorize protected server requests solely from an unverified session object.
- Do not run destructive migrations, alter existing Supabase data, change production environment variables, or modify existing Vercel production aliases during foundation work.

## Verification gates

**Gate A — Foundation:** branch exists; app structure and manifest are present; install/build succeeds.

**Gate B — Integration:** Supabase URL/key availability is checked without exposing values; authentication flow works; OpenAI is called only from a protected server route; persistence and RLS are verified.

**Gate C — Critical journey:** register → sign in → submit legal question → receive response → reload and see history; cross-user access is denied.

**Gate D — Preview evidence:** branch preview deployment is READY; smoke tests pass against the exact preview URL; record commit SHA, deployment URL, build result, test results and known limitations.

Do not label the MVP operational until Gates A–D have evidence. Production deployment or merging into `main` requires a separate review after the preview passes.

## Immediate next action

Implement the minimal foundation on this branch only. Before integration testing, inspect the Vercel project/build configuration and confirm the required environment-variable *names* exist without retrieving or displaying their values. If any external credentials or project permissions are missing, report the exact blocker without fabricating a successful integration.
