import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE_NAME, SITE_URL, TAGLINE } from "@/lib/seo";

// Defaults for every page. Public pages override these with pageMetadata()
// from lib/seo.js, which adds their canonical URL and their own social tags.
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GhstMail — Disposable Email Aliases & Private Forwarding",
    template: "%s — GhstMail",
  },
  description:
    "Give every site its own email alias that forwards to your real inbox. Reply anonymously, block spam by domain, and switch off any alias that leaks. Free.",
  openGraph: {
    title: TAGLINE,
    description:
      "Generate disposable email aliases that forward to your inbox. Reply anonymously. Block spam. Stay invisible.",
    siteName: SITE_NAME,
    type: "website",
  },
  // No title or description here: X falls back to each page's og:title and
  // og:description, so shared links describe the page that was shared.
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
