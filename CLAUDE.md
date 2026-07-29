# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GhstMail is a privacy-first disposable email alias service. This repo is the **frontend** — a Next.js 14 app (App Router) that talks to a separate backend API.

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — serve production build

No test runner or linter is configured.

## Architecture

**Stack:** Next.js 14 (App Router), React 18, Tailwind CSS 3, shadcn/ui (radix-maia style, JSX not TSX)

**Backend communication:** All API calls go through `lib/api.js`, which wraps `fetch` with JWT auth (token stored in `localStorage` as `ghstmail_token`). The backend URL comes from `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:3001`).

**Two API surfaces exist, and they are not interchangeable:**
- `/api/*` — session JWT. What this app and the Chrome extension use. Returns raw column names (`is_active`) and a plain string `error` on failure.
- `/v1/*` — API keys with scopes. The public surface, used by the CLI and third parties. Returns normalised names (`active`), lists as `{object:"list", data, has_more}`, and a structured error envelope `{error:{type,code,message,param}, request_id}`. Documented at `/docs` and in the OpenAPI spec at `https://api.ghstmail.space/v1/openapi.json`.

`lib/api.js` targets `/api/*` only. Do not repoint it at `/v1`: `lib/api.js` does `throw new Error(data.error || ...)`, which expects `error` to be a string, so every `/v1` failure would surface as `[object Object]`. CORS is also deliberately disabled on `/v1` so a browser cannot hold an API key.

**Auth flow:** Token-based. Login/register pages call `api.login`/`api.register`, store the JWT via `setToken()`. The dashboard layout checks for the token on mount and redirects to `/login` if missing. The landing page redirects to `/dashboard` if a token exists.

**Pages** (client components via `"use client"` unless marked server):
- `/` — marketing landing page
- `/docs` — **server component.** Public API reference. Code samples are highlighted at render time by `app/docs/highlight.js`, a small hand-written tokenizer, so the page ships no client JS beyond `app/docs/code-block.js` (the copy button). Do not add a dependency for this.
- `/pricing` — plans
- `/login`, `/register` — auth forms
- `/dashboard` — alias management (CRUD, toggle active/inactive, copy address, expiration tracking)
- `/dashboard/filters` — email filter management (block by domain)
- `/dashboard/keys` — API key management. `messages:send` is the one scope unticked by default, matching the server's column default.
- `/device` — approval step for the CLI's device login (RFC 8628). Redirects to `/login?next=...` when signed out.
- `/privacy` — **server component.** Privacy policy. This is a published legal claim: if you change what the backend stores, change this too.

Server components are server components because they export `metadata` for SEO and need no interactivity.

**UI components:** `components/ui/` contains shadcn/ui primitives (Button, Card, Input, Badge, etc.). Inline SVG icons are used throughout instead of an icon library — each page defines its own icon components.

**Styling:** Dark mode only (`<html className="dark">`). Uses CSS variables for theming (defined in `globals.css`). Custom fonts: Syne (display/headings) and Outfit (body). Custom animations for fade-up and glow effects defined in `tailwind.config.js`.

**Import aliases:** `@/components`, `@/lib`, `@/hooks` (configured in `jsconfig.json`).
