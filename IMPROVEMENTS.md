# Follow-up work

## Existing issues (outside the landing scope)

- The user intentionally removed the four files in `tests/` during the landing work. The `test:auth` and `test:smoke` scripts still reference them; decide whether to retire those scripts or introduce a replacement suite in a testing-focused task. Before removal, the auth harness did not configure `SECRET_KEY` and used unsigned placeholder JWTs; any replacement must align with the current `jwtVerify` implementation without bypassing production verification.
- `FormField.tsx` has unused `accept` and `multiple` props reported by lint.
- Root metadata still uses the Next.js starter defaults for routes without their own metadata. The landing now has its own title and description.

## External dependencies

- Property search and real inventory require backend contracts. The only current API controller is `AuthController`; do not infer business routes from the UI.
- End-to-end authentication validation requires a running ASP.NET API and trusted local HTTPS certificate. Fixture-based smoke tests are not evidence of this integration.

## Decisions and assets still pending

- Supply final photos using the slot mapping documented in [LANDING.md](LANDING.md), then review crops, image descriptions, file sizes and text contrast over the hero/closing photos.

## Documentation mismatch to reconcile separately

- `AGENTS.md` mentions `API_BASE_URL`, while the current `auth-backend.ts` reads `API_URL` and `SECRET_KEY`. Confirm the intended configuration and align the auth documentation/tests in an authentication-focused task. The landing change does not alter these contracts.
- `AGENTS.md` references an `AUTHENTICATION.md` file that is absent from the current checkout. Restore or rewrite it against the implemented session flow before changing session storage or concurrency.
