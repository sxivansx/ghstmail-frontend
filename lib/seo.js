// Shared search and social metadata for the public pages.

export const SITE_URL = "https://www.ghstmail.space";
export const SITE_NAME = "GhstMail";
export const TAGLINE = "GhstMail — Your email, invisible.";

// A page that sets its own openGraph replaces the layout's whole openGraph,
// including the image from app/opengraph-image.js, so it is listed here again.
const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: TAGLINE };

// Metadata for a public page: its canonical URL plus Open Graph tags that
// describe that page rather than the home page. `path` is relative to
// SITE_URL, which the root layout sets as metadataBase.
export function pageMetadata({ path, title, description, ogTitle, ogDescription }) {
  const plainTitle = typeof title === "string" ? `${title} — ${SITE_NAME}` : title.absolute;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: path,
      title: ogTitle || plainTitle,
      description: ogDescription || description,
      images: [OG_IMAGE],
    },
  };
}
