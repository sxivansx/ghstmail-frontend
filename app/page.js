import LandingPage from "./landing-page";
import { pageMetadata, SITE_NAME, SITE_URL, TAGLINE } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/",
  title: { absolute: "GhstMail — Disposable Email Aliases & Private Forwarding" },
  description:
    "Give every site its own email alias that forwards to your real inbox. Reply anonymously, block spam by domain, and switch off any alias that leaks. Free.",
  ogTitle: TAGLINE,
  ogDescription:
    "Generate disposable email aliases that forward to your inbox. Reply anonymously. Block spam. Stay invisible.",
});

// Tells search engines and AI assistants what GhstMail is and who runs it.
// Every claim here is also made on the page; keep the two in step.
const ORG_ID = `${SITE_URL}/#organization`;
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/apple-icon.png`,
      email: "support@ghstmail.space",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#app`,
      name: SITE_NAME,
      url: SITE_URL,
      description:
        "Disposable email aliases that forward to your real inbox. Reply from the alias, block senders by domain, and switch off any alias that starts getting spam.",
      applicationCategory: "SecurityApplication",
      operatingSystem: "Web, Chrome",
      browserRequirements: "Requires JavaScript",
      featureList: [
        "Unlimited email aliases",
        "Anonymous replies from the alias",
        "Block senders by domain across every alias",
        "Aliases that expire on a timer",
        "Chrome extension that fills in email fields",
        "Command line tool and REST API",
      ],
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": ORG_ID },
    },
  ],
};

// JSON inside a script tag must not contain "</script>".
const STRUCTURED_DATA_JSON = JSON.stringify(STRUCTURED_DATA).replace(/</g, "\\u003c");

// The session token lives in localStorage, which the server cannot see, so the
// signed-in redirect has to run in the browser. It runs before the landing page
// is parsed, and hides the page while the dashboard loads, so a signed-in
// visitor never sees it flash. Crawlers have no token and get the full page.
const SIGNED_IN_REDIRECT = `try{if(localStorage.getItem("ghstmail_token")){document.documentElement.style.visibility="hidden";location.replace("/dashboard")}}catch(e){}`;

export default function Home() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SIGNED_IN_REDIRECT }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: STRUCTURED_DATA_JSON }} />
      <LandingPage />
    </>
  );
}
