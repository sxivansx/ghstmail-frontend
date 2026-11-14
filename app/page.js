import LandingPage from "./landing-page";
import { pageMetadata, TAGLINE } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/",
  title: { absolute: "GhstMail — Disposable Email Aliases & Private Forwarding" },
  description:
    "Give every site its own email alias that forwards to your real inbox. Reply anonymously, block spam by domain, and switch off any alias that leaks. Free.",
  ogTitle: TAGLINE,
  ogDescription:
    "Generate disposable email aliases that forward to your inbox. Reply anonymously. Block spam. Stay invisible.",
});

// The session token lives in localStorage, which the server cannot see, so the
// signed-in redirect has to run in the browser. It runs before the landing page
// is parsed, and hides the page while the dashboard loads, so a signed-in
// visitor never sees it flash. Crawlers have no token and get the full page.
const SIGNED_IN_REDIRECT = `try{if(localStorage.getItem("ghstmail_token")){document.documentElement.style.visibility="hidden";location.replace("/dashboard")}}catch(e){}`;

export default function Home() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SIGNED_IN_REDIRECT }} />
      <LandingPage />
    </>
  );
}
