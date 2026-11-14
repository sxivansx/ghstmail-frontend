import { SITE_URL } from "@/lib/seo";
import { releases } from "@/lib/changelog";

// The public pages worth finding in search. Account pages (dashboard, device,
// password reset) are left out and marked noindex in next.config.js.
//
// Only the changelog gets a lastModified, because it is the only page whose
// date is known for certain; a guessed date teaches search engines to ignore
// the field.
const PAGES = ["/", "/pricing", "/docs", "/changelog", "/privacy", "/terms", "/refunds", "/register", "/login"];

export default function sitemap() {
  return PAGES.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    ...(path === "/changelog" && releases[0] ? { lastModified: releases[0].date } : {}),
  }));
}
