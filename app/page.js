import LandingPage from "./landing-page";

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
