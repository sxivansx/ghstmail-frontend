# ghstmail-frontend

The web frontend for [GhstMail](https://ghstmail.space), a privacy-first
disposable email alias service. Create an address, put it in a signup form, and
mail forwards to your real inbox without handing over your real address.

This repo is the Next.js app only. The backend that actually moves mail lives on
a separate server (see [Architecture](#architecture)).

## Quick start

```bash
npm install
cp .env.example .env.local     # point NEXT_PUBLIC_API_URL at the backend
npm run dev                    # http://localhost:3000
```

| Script | Does |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | production build |
| `npm run start` | serve the production build |

There is no test runner or linter configured.

## Environment

```
NEXT_PUBLIC_API_URL=https://api.ghstmail.space
```

Defaults to `http://localhost:3001` when unset. It is the only variable the app
needs.

## Routes

| Route | Rendering | What it is |
|---|---|---|
| `/` | client | Marketing landing page. Redirects to `/dashboard` when a token is present. |
| `/docs` | **server** | Public API reference. Ships no client JavaScript apart from the copy buttons. |
| `/pricing` | client | Plans |
| `/login`, `/register` | client | Auth forms |
| `/dashboard` | client | Alias management: create, label, expire, enable/disable, copy, delete |
| `/dashboard/filters` | client | Block or allow senders by domain |
| `/dashboard/keys` | client | Create and revoke API keys, with per-scope checkboxes |
| `/device` | client | Approval step for the CLI's device login |
| `/privacy` | **server** | Privacy policy |

`/docs` and `/privacy` are server components because they export `metadata` for
SEO and need no interactivity. Everything else is `"use client"`.

## Architecture

```
      browser
         |
    ghstmail.space              Vercel, this repo
         |
         v
  api.ghstmail.space            Cloudflare -> Caddy -> Fastify, on a droplet
         |
    +----+----+
    |         |
 Postgres   Haraka (SMTP :25)   receives mail for aliases, calls the backend
```

Two API surfaces on the same host, and they are not interchangeable:

- **`/api/*`** — session JWT, used by this app and the Chrome extension. Returns
  raw column names (`is_active`) and a plain string `error` on failure.
- **`/v1/*`** — API keys, the public surface used by the CLI and third parties.
  Returns a normalised shape (`active`) and a structured error envelope.

`lib/api.js` wraps `fetch` for `/api/*` only, attaching the JWT from
`localStorage` under `ghstmail_token`. Do not repoint it at `/v1`: the error
shapes differ, and every failure would render as `[object Object]`.

Auth is token-based. `app/dashboard/layout.js` checks for the token on mount and
redirects to `/login` when it is missing.

## Related pieces

| Piece | Where |
|---|---|
| API reference | [ghstmail.space/docs](https://ghstmail.space/docs) |
| OpenAPI 3.1 spec | [api.ghstmail.space/v1/openapi.json](https://api.ghstmail.space/v1/openapi.json) |
| CLI | [`ghstmail` on npm](https://www.npmjs.com/package/ghstmail), [govindup63/ghstmail-cli](https://github.com/govindup63/ghstmail-cli) |
| Chrome extension | [Web Store](https://chromewebstore.google.com/detail/ghstmail/ejnaojhagohicodfhmgehnhmmahjohbj) |
| Backend and Haraka config | on the droplet at `/root/ghstmail`, not in git |

## Design

Dark mode only (`<html className="dark">`), themed through CSS variables in
`globals.css`. Syne for display, Outfit for body. The brand move is one gold
accent (`#E8BA30`) per view, with nothing competing with it.

Icons are inline SVG defined per page rather than an icon library, which is why
the same `GhostIcon` appears in several files.

`app/docs/highlight.js` is a small hand-written syntax highlighter for the code
samples. It runs on the server so highlighted code costs the reader no
JavaScript, and it exists instead of a dependency because the sample set is known
and small.

## Deployment

Pushes to `main` deploy to Vercel. The apex redirects to `www`, so
`ghstmail.space/docs` returns a 307 to `www.ghstmail.space/docs`. That is
expected, not a fault.
