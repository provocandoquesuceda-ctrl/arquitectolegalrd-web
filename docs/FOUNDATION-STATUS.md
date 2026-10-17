# MVP foundation status

## Current state

The working branch contains a minimal Next.js App Router foundation, a Spanish-language responsive landing page, and a health endpoint. This is a scaffold only; it is not yet an authenticated legal assistant.

## Implemented in this branch

- Next.js / React / TypeScript manifest and scripts.
- Responsive landing page that labels all target capabilities as pending integration.
- `GET /api/health` endpoint for deployment smoke tests.
- Environment variable names documented without credentials.
- Foundation plan and security/acceptance gates in `docs/mvp-foundation-plan.md`.

## Not implemented or verified yet

- Supabase client, SSR cookie refresh, registration, login, and server-side identity verification.
- OpenAI server integration and legal-response handling.
- Database migration, row-level security, and per-user history.
- Automated build/test results and branch preview deployment.
- Browser end-to-end journey.

## Verification required before claiming operational status

1. Install dependencies and run `npm run typecheck` and `npm run build`.
2. Confirm `GET /api/health` returns HTTP 200 on a branch preview.
3. Integrate Supabase SSR and verify protected routes.
4. Add history schema/RLS and server-only OpenAI calls.
5. Test register → sign in → legal question → response → persisted history, including denial of cross-user access.
6. Record the exact commit, build result, test evidence, and preview URL.

No credentials are stored in this repository. Do not merge to `main` or change production deployments based solely on this scaffold.
