# Security Review — Forge

Code-grounded review against the standard 20-point pen-test checklist. Forge is a fully
offline, client-only text workbench (transform/analyze/find-replace/encode tools). No backend,
no accounts, no network calls of any kind — all state lives in `localStorage`.

| # | Check | Result |
|---|-------|--------|
| 1 | HTTP/2 Rapid Reset (CVE-2023-44487) | N/A — no server component |
| 2 | bcrypt 72-byte truncation | N/A — no auth/passwords |
| 3 | SAML signature bypass (CVE-2024-45409) | N/A — no SAML/SSO |
| 4 | nOAuth | N/A — no OAuth |
| 5 | GraphQL alias batching | N/A — no GraphQL |
| 6 | TOTP replay (RFC 6238 §5.2) | N/A — no TOTP/2FA |
| 7 | ReDoS | No — `replace.html`'s Find & Replace tool builds a regex directly from the user's own pattern (`buildRegex()`, `replace.html:41`) when the "regex" checkbox is on, and runs it against their own text on every keystroke. A pathological pattern (e.g. nested quantifiers) can freeze that user's own browser tab, but this is 100% client-side and self-contained — it cannot affect any other user, session, or server, so it doesn't meet the checklist's server-side-DoS concern. Not a finding. |
| 8 | JWT algorithm confusion | N/A — no JWTs |
| 9 | HTTP request smuggling | N/A — no server |
| 10 | Web cache poisoning | N/A — static site, no server-side cache |
| 11 | Spoofed X-Forwarded-For | N/A — no backend reads request headers |
| 12 | Postgres views bypassing RLS | N/A — no database |
| 13 | `Math.random()` for security tokens | No — not used anywhere in this repo for anything security-relevant (the one shuffle transform operates only on the user's own pasted lines) |
| 14 | Timing attacks on secret comparison | N/A — no secrets |
| 15 | Padding oracle | N/A — the encode/decode tools (Base64, hex, binary, ROT13) are reversible encodings for text manipulation, not security encryption, and are documented as such |
| 16 | Server-side prototype pollution | N/A — no server |
| 17 | Server-side template injection | N/A — no server-side templating |
| 18 | XXE | N/A — no XML parsing anywhere |
| 19 | Cross-site WebSocket hijacking | N/A — no WebSocket use |
| 20 | Unicode username normalization | N/A — no usernames/accounts |

## Findings outside the 20-point list

None. Escaping is consistent and, in the one place it matters most, applied in the right order:

- `esc()` (`forge.js:45`, `&<>` only) is used everywhere user-authored text reaches `innerHTML`:
  the word-frequency table in Analyze (`analyze.html:38`), saved-snippet names and transform
  history labels in Settings (`settings.html:41,43`).
- **Find & Replace's live highlighted preview** (`replace.html:46`) escapes the *entire* input
  string with `esc()` **before** running the user's regex against it and wrapping matches in
  `<mark>` tags — `esc(s).replace(new RegExp(re.source,re.flags), m => '<mark>'+m+'</mark>')`.
  Because the string is already HTML-escaped at the point the regex runs, any `<`/`>`/`&`
  characters in the matched text are already entities and can't reopen a tag — so wrapping the
  (already-escaped) match in `<mark>` doesn't reintroduce injection risk, even though the regex
  pattern itself is attacker/user-controlled.
- Every other `innerHTML` site across `forge.js`/`index.html`/`transform.html`/`encode.html`
  only ever inserts hardcoded UI chrome (operation names, icons, category labels) — never
  user-typed text.
- The "strip HTML" transform operation and all encode/decode operations write their result to a
  `<textarea>`'s `.value` (`transform.html:32`), never to `innerHTML`, so there's no path for a
  transform result to execute as markup even before any escaping question arises.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01RCiZNqYmetGt5SuieaZQcC
