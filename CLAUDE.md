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

**Auth flow:** Token-based. Login/register pages call `api.login`/`api.register`, store the JWT via `setToken()`. The dashboard layout checks for the token on mount and redirects to `/login` if missing. The landing page redirects to `/dashboard` if a token exists.

**Pages (all client components via `"use client"`):**
- `/` — marketing landing page
- `/login`, `/register` — auth forms
- `/dashboard` — alias management (CRUD, toggle active/inactive, copy address, expiration tracking)
- `/dashboard/filters` — email filter management (block by domain)
- `/privacy` — privacy policy

**UI components:** `components/ui/` contains shadcn/ui primitives (Button, Card, Input, Badge, etc.). Inline SVG icons are used throughout instead of an icon library — each page defines its own icon components.

**Styling:** Dark mode only (`<html className="dark">`). Uses CSS variables for theming (defined in `globals.css`). Custom fonts: Syne (display/headings) and Outfit (body). Custom animations for fade-up and glow effects defined in `tailwind.config.js`.

**Import aliases:** `@/components`, `@/lib`, `@/hooks` (configured in `jsconfig.json`).
