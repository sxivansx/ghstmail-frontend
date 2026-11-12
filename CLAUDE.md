# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GhstMail is a privacy-first disposable email alias service. This repo is the **frontend** — a Next.js 14 app (App Router) that talks to a separate backend API.

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — serve production build
- `npm test` — tests for `lib/api.js`, using Node's built-in runner

No linter is configured.

## Architecture

**Stack:** Next.js 14 (App Router), React 18, Tailwind CSS 3, shadcn/ui (radix-maia style, JSX not TSX)

**Backend communication:** All API calls go through `lib/api.js`, which wraps `fetch` with JWT auth (token stored in `localStorage` as `ghstmail_token`). The backend URL comes from `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:3001`).

**Two API surfaces exist, and they are not interchangeable:**
- `/api/*` — session JWT. What this app and the Chrome extension use. Returns raw column names (`is_active`) and a plain string `error` on failure.
- `/v1/*` — API keys with scopes. The public surface, used by the CLI and third parties. Returns normalised names (`active`), lists as `{object:"list", data, has_more}`, and a structured error envelope `{error:{type,code,message,param}, request_id}`. Documented at `/docs` and in the OpenAPI spec at `https://api.ghstmail.space/v1/openapi.json`.

`lib/api.js` targets `/api/*` only. The Better Auth calls (`socialSignIn`, `exchangeSession`, `requestPasswordReset`, `resetPassword`) go to `/api/auth/*` with `credentials: "include"` and never send the JWT; those routes return `{ message }` rather than `{ error }`. Do not repoint it at `/v1`: `lib/api.js` does `throw new Error(data.error || ...)`, which expects `error` to be a string, so every `/v1` failure would surface as `[object Object]`. CORS is also deliberately disabled on `/v1` so a browser cannot hold an API key.

**Auth flow:** Token-based. Login/register pages call `api.login`/`api.register`, store the JWT via `setToken()`. The dashboard layout checks for the token on mount and redirects to `/login` if missing. The landing page redirects to `/dashboard` if a token exists.

**Pages** (client components via `"use client"` unless marked server):
- `/` — marketing landing page. Styled by `app/landing.css` (plain CSS, every rule scoped under `.lp`) rather than Tailwind. The demos (alias maker, relay diagram, extension tour, headline fire) are driven by `app/landing-effects.js`, which `page.js` mounts in one effect; the pure helpers live in `lib/landing-demo.js` and are tested. Avoid class names that are also Tailwind utilities (`ring` bit once).
- `/docs` — **server component.** Public API reference. Code samples are highlighted at render time by `app/docs/highlight.js`, a small hand-written tokenizer, so the only client JS is three small components: `code-block.js` (copy button), `docs-nav.js` (marks the section you are reading) and `try-it.js` (the self-typing sample request in the hero, which sends nothing). Do not add a dependency for this.
- `/pricing` — plans
- `/login`, `/register` — auth forms, with Google/GitHub buttons from `components/social-sign-in.jsx` when `NEXT_PUBLIC_AUTH_PROVIDERS` lists them
- `/forgot-password`, `/reset-password` — password reset through the backend's Better Auth routes
- `/auth/complete` — where Google/GitHub sign-in lands; calls `api.exchangeSession()` to swap the Better Auth session cookie for the dashboard JWT
- `/dashboard` — alias management (CRUD, toggle active/inactive, copy address, expiration tracking)
- `/dashboard/filters` — email filter management (block by domain)
- `/dashboard/keys` — API key management. `messages:send` is the one scope unticked by default, matching the server's column default.
- `/device` — approval step for the CLI's device login (RFC 8628). Redirects to `/login?next=...` when signed out.
- `/privacy` — **server component.** Privacy policy. This is a published legal claim: if you change what the backend stores, change this too.

Server components are server components because they export `metadata` for SEO and need no interactivity.

**UI components:** `components/ui/` contains shadcn/ui primitives (Button, Card, Input, Badge, etc.). `components/site-header.jsx` is the top bar shared by docs, pricing, privacy and the auth pages. Inline SVG icons are used throughout instead of an icon library — each page defines its own icon components.

**Styling:** Dark mode only (`<html className="dark">`). Uses CSS variables for theming (defined in `globals.css`). Custom fonts: Bricolage Grotesque (display/headings), Outfit (body) and Martian Mono (addresses and code), loaded by the `@import` at the top of `globals.css`. Custom animations for fade-up and glow effects defined in `tailwind.config.js`.

**Import aliases:** `@/components`, `@/lib`, `@/hooks` (configured in `jsconfig.json`).
