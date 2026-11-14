import { SITE_URL } from "@/lib/seo";

// Everything may be crawled. Account pages are kept out of search results by
// the X-Robots-Tag header in next.config.js rather than by a Disallow here: a
// crawler blocked from a page never sees its noindex.
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
