import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Reads ?next= from the current URL and returns it only if it is a safe
 * same-origin path, otherwise returns the fallback.
 *
 * The guard is the point. Sending a freshly-authenticated user to whatever
 * ?next= says is an open redirect: `?next=https://evil.example` or
 * `?next=//evil.example` would hand them to an attacker's copy of the login
 * page at the exact moment they trust the site. Only a path is ever accepted.
 */
export function safeNextPath(fallback = "/dashboard") {
  if (typeof window === "undefined") return fallback;

  const raw = new URLSearchParams(window.location.search).get("next");
  if (!raw) return fallback;

  // Protocol-relative ("//host") and backslash variants are the usual bypasses.
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) {
    return fallback;
  }
  return raw;
}
