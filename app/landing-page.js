"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { mountLanding } from "./landing-effects";
import "./landing.css";

// Small line icons for the "what we keep" lists.
const GLYPHS = {
  box: "M21 8v12a1 1 0 01-1 1H4a1 1 0 01-1-1V8m18 0l-2.4-4.2A1 1 0 0017.7 3H6.3a1 1 0 00-.9.8L3 8m18 0H3m6 4h6",
  mail: "M3 6.5A1.5 1.5 0 014.5 5h15A1.5 1.5 0 0121 6.5v11a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 17.5v-11zM3.5 7l8.5 6 8.5-6",
  tag: "M3 12.6V4a1 1 0 011-1h8.6a1 1 0 01.7.3l7.4 7.4a1 1 0 010 1.4l-8.6 8.6a1 1 0 01-1.4 0l-7.4-7.4a1 1 0 01-.3-.7zM7.5 7.5h.01",
  reply: "M9 17l-5-5 5-5M4 12h11a5 5 0 015 5v2",
  thread: "M5 9h14M5 15h14M10 4L8 20M16 4l-2 16",
  server: "M4 5.5A1.5 1.5 0 015.5 4h13A1.5 1.5 0 0120 5.5v4a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 9.5v-4zM4 14.5A1.5 1.5 0 015.5 13h13a1.5 1.5 0 011.5 1.5v4a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 18.5v-4zM7.5 7.5h.01M7.5 16.5h.01",
  none: "M12 21a9 9 0 100-18 9 9 0 000 18zM5.6 5.6l12.8 12.8",
};

function Glyph({ d }) {
  return (
    <svg className="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const CLI_SAMPLE = `<span class="c"># create an alias and copy it</span>
<span class="k">$</span> ghstmail new github
<span class="o">github.k7f2q@ghstmail.space</span>
  copied to clipboard  label: github  never expires

<span class="c"># a throwaway that cleans itself up</span>
<span class="k">$</span> ghstmail new "free trial" --expires 24h

<span class="c"># did the signup email arrive?</span>
<span class="k">$</span> ghstmail check github
  state      active
  received   1
  forwarded  1

<span class="c"># block a sender across every alias</span>
<span class="k">$</span> ghstmail filter add spam.example.com`;

const CURL_SAMPLE = `<span class="k">$</span> curl https://api.ghstmail.space/v1/aliases \\
    -H "Authorization: Bearer $GHSTMAIL_KEY" \\
    -d '{"label": "newsletter"}'

{
  "object": "alias",
  "address": <span class="o">"newsletter.k7f2q@ghstmail.space"</span>,
  "label": "newsletter",
  "active": true
}`;

export default function LandingPage() {
  const router = useRouter();
  const root = useRef(null);

  // The page is rendered on the server so search engines and link previews get
  // the full text. Signed-in visitors are sent to the dashboard by the inline
  // script in page.js before anything paints; this catches the case it cannot,
  // a client-side navigation back to "/".
  useEffect(() => {
    if (localStorage.getItem("ghstmail_token")) {
      router.replace("/dashboard");
      return;
    }
    return mountLanding(root.current);
  }, [router]);

  return (
    <div className="lp" ref={root}>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="ghost" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C7.58 2 4 5.58 4 10v9a1 1 0 001.7.7L7.4 18l1.7 1.7a1 1 0 001.4 0L12 18.2l1.5 1.5a1 1 0 001.4 0L16.6 18l1.7 1.7A1 1 0 0020 19v-9c0-4.42-3.58-8-8-8z"/>
          <circle cx="9" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="10" r="1.5" fill="currentColor"/>
        </symbol>
      </svg>

      <header className="nav">
        <div className="wrap">
          <a className="brand" href="#top"><svg aria-hidden="true"><use href="#ghost"/></svg>GhstMail</a>
          <nav className="nav-links" aria-label="Main">
            <a href="#how">How it works</a>
            <a href="#developers">CLI and API</a>
            <a href="#privacy">What we keep</a>
            <Link href="/pricing">Pricing</Link>
          </nav>
          <div className="nav-end">
            <Link className="btn btn-text" href="/login">Log in</Link>
            <Link className="btn btn-primary btn-sm" href="/register">Create free account</Link>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero wrap">
          <div className="hero-grid">
            <div>
              <h1 className="rise">Sign up with an email you can <span className="burn" data-t="burn">burn<canvas className="fire" id="fire" aria-hidden="true"></canvas></span>.</h1>
              <p className="lede rise" style={{ "--i": 1 }}>GhstMail gives each site its own alias and forwards the mail to your real inbox. Reply from the alias, and when one starts getting spam, you know who leaked it and you switch it off.</p>
              <div className="hero-actions rise" style={{ "--i": 2 }}>
                <Link className="btn btn-primary" href="/register">Create free account</Link>
                <a className="btn btn-quiet" href="https://chromewebstore.google.com/detail/ghstmail/ejnaojhagohicodfhmgehnhmmahjohbj"><img src="/chrome.svg" alt="" width="18" height="18" />Add to Chrome</a>
              </div>
              <p className="hero-note rise" style={{ "--i": 3 }}>Free, with unlimited aliases. No card.</p>
            </div>

            <div className="maker-wrap rise" style={{ "--i": 2 }}>
              <svg className="peek" id="peek" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2C7.58 2 4 5.58 4 10v9a1 1 0 001.7.7L7.4 18l1.7 1.7a1 1 0 001.4 0L12 18.2l1.5 1.5a1 1 0 001.4 0L16.6 18l1.7 1.7A1 1 0 0020 19v-9c0-4.42-3.58-8-8-8z" fill="#0b0a08"/>
                <g id="eyes">
                  <circle className="eye" cx="9" cy="9.2" r="1.5" fill="currentColor" stroke="none" />
                  <circle className="eye" cx="15" cy="9.2" r="1.5" fill="currentColor" stroke="none" />
                  <path className="squeeze" d="M7.8 7.9l2.3 1.3-2.3 1.3" />
                  <path className="squeeze" d="M16.2 7.9l-2.3 1.3 2.3 1.3" />
                </g>
              </svg>
              <div className="maker">
                <label htmlFor="site">Try it. Where are you signing up?</label>
                <input className="field" id="site" autoComplete="off" spellCheck={false} maxLength={24} placeholder="netflix" />
                <div className="out">
                  <p>Give them this instead of your real email</p>
                  <output className="alias" id="alias" htmlFor="site" aria-live="polite"></output>
                  <div className="out-actions">
                    <button className="btn btn-quiet btn-sm" id="copy" type="button">Copy</button>
                    <button className="btn btn-quiet btn-sm btn-burn" id="burn" type="button">Burn it</button>
                    <small>forwards to <span className="mono hidden-addr">y••••@•••••.com</span></small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="band stage-sec" id="how">
          <div className="wrap">
            <div className="stage-head">
              <h2>What each side sees</h2>
              <div className="tabs" role="tablist" aria-label="Scenario">
                <button role="tab" aria-selected="true" data-play="in">Mail arrives<i></i></button>
                <button role="tab" aria-selected="false" data-play="reply">You reply<i></i></button>
                <button role="tab" aria-selected="false" data-play="off">You burn it<i></i></button>
              </div>
            </div>

            <div className="relay" id="stage">
              <div className="relay-grid">
                <div className="side">
                  <header className="side-head">
                    <span className="avatar" data-site-initial aria-hidden="true">N</span>
                    <div>
                      <h3 data-site>Netflix</h3>
                      <p>What the site has</p>
                    </div>
                  </header>
                  <dl className="fact">
                    <dt>Email on file</dt>
                    <dd className="on-file" data-alias></dd>
                  </dl>
                  <div className="mailbox">
                    <div className="msg" data-on="in" data-role="from"><span className="dir">Sent</span><b>Confirm your email</b><span className="meta">to <span data-alias-short></span></span></div>
                    <div className="msg" data-on="reply" data-role="to"><span className="dir">Received</span><b>Re: Confirm your email</b><span className="meta">from <span data-alias-short></span></span></div>
                    <div className="msg" data-on="off" data-role="from"><span className="dir">Sent</span><b>Offers picked for you</b><span className="meta">to <span data-alias-short></span></span></div>
                  </div>
                </div>

                <div className="wire" aria-hidden="true">
                  <div className="track"><div className="pkt" id="pkt"></div></div>
                  <div className="hub" id="mid">
                    <svg><use href="#ghost"/></svg>
                  </div>
                  <span className="hub-text" id="mid-text">forwards, keeps no copy</span>
                </div>

                <div className="side">
                  <header className="side-head">
                    <span className="avatar you" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" /></svg>
                    </span>
                    <div>
                      <h3>Your inbox</h3>
                      <p>What you see</p>
                    </div>
                  </header>
                  <dl className="fact">
                    <dt>Your real email</dt>
                    <dd className="hidden-addr">y••••@•••••.com</dd>
                  </dl>
                  <div className="mailbox">
                    <div className="msg" data-on="in" data-role="to"><span className="dir">Inbox</span><b>Confirm your email</b><span className="meta">from <span data-site>Netflix</span>, via <span data-alias-short></span></span></div>
                    <div className="msg" data-on="reply" data-role="from"><span className="dir">Sent</span><b>Re: Confirm your email</b><span className="meta">goes out as <span data-alias-short></span></span></div>
                    <div className="msg quiet" data-on="off" data-role="to"><span className="dir">Inbox</span><b>Nothing arrives</b><span className="meta">the alias is gone</span></div>
                  </div>
                </div>
              </div>
              <div className="relay-foot">
                <span className="step" id="step-no" aria-hidden="true">1</span>
                <p className="caption" id="caption" aria-live="polite"></p>
              </div>
            </div>
          </div>
        </section>

        <section className="bento-sec wrap" id="extension">
        <h2>Everything in the box</h2>
        <div className="bento">
          <article className="tile b-ext">
            <div className="ext-top">
              <div>
                <h3>The Chrome extension fills it in for you</h3>
                <p>Every email field on the web gets a small GET button. One click makes an alias named after the site and types it into the form.</p>
              </div>
              <a className="btn btn-primary" href="https://chromewebstore.google.com/detail/ghstmail/ejnaojhagohicodfhmgehnhmmahjohbj"><img src="/chrome.svg" alt="" width="18" height="18" />Add to Chrome</a>
            </div>
            <ol className="steps" id="ext-steps">
              <li>Spots the email field</li>
              <li>Names the alias after the site</li>
              <li>Fills it in and remembers it</li>
            </ol>
            <div className="browser" id="ext-demo">
                <div className="browser-bar" aria-hidden="true"><i></i><i></i><i></i><span id="ext-url">parcelbird.example/signup</span><svg className="tool"><use href="#ghost"/></svg></div>
                <div className="page">
                  <div className="form" id="ext-form">
                    <strong id="ext-site">Parcelbird</strong>
                    <span className="hint" id="ext-sub">Create your account</span>
                    <label>Email
                      <span className="fake email" id="ext-field"><output id="ext-out"></output>
                        <button className="get" id="ext-btn" type="button" aria-label="Get an alias for this field"><span id="ext-btn-t">GET</span><svg aria-hidden="true"><use href="#ghost"/></svg></button>
                      </span>
                    </label>
                    <span className="submit" aria-hidden="true">Continue</span>
                  </div>
                  <div className="pop" id="ext-pop" aria-hidden="true">
                    <div className="pop-head"><svg><use href="#ghost"/></svg>GhstMail</div>
                    <span className="pop-label">Recent</span>
                    <ul id="ext-recent"></ul>
                  </div>
                  <svg className="cursor" id="ext-cur" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3l14 8-6.2 1.6L9.6 19z" fill="#efe9dc" stroke="#0b0a08" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                </div>
              </div>
          </article>

          <article className="tile b-exp">
            <h3>Set one to expire</h3>
            <p>For a free trial or a one-off download. When the timer runs out, the alias stops taking mail.</p>
            <div className="viz dial-row">
              <div className="dial">
                <svg viewBox="0 0 104 104" aria-hidden="true"><circle className="trk" cx="52" cy="52" r="46" /><circle className="val" id="ring" cx="52" cy="52" r="46" /></svg>
                <span id="left"></span>
              </div>
              <div className="dial-side">
                <span className="mono">trial.x9m2d@ghstmail.space</span>
                <div className="seg" role="group" aria-label="Expires in">
                  <button type="button" aria-pressed="false" data-h="1">1h</button>
                  <button type="button" aria-pressed="true" data-h="24">24h</button>
                  <button type="button" aria-pressed="false" data-h="168">7d</button>
                </div>
              </div>
            </div>
          </article>

          <article className="tile b-block">
            <h3>Block a whole domain</h3>
            <p>One rule covers every alias you have.</p>
            <div className="viz">
              <ul className="mail" id="mail">
                <li data-d="promo.example"><span>deals@promo.example</span><span>forwarded</span></li>
                <li><span>billing@acme.example</span><span>forwarded</span></li>
                <li data-d="promo.example"><span>offers@promo.example</span><span>forwarded</span></li>
              </ul>
              <button className="btn btn-quiet btn-sm" id="block" type="button" aria-pressed="false">Block promo.example</button>
            </div>
          </article>

          <article className="tile b-leak">
            <h3>See who leaked you, then burn it</h3>
            <p>Each alias goes to one site, so spam points straight at the culprit.</p>
            <ul className="viz leaks" id="leaks">
              <li><span className="a">parcelbird.k7f2q@ghstmail.space</span><span className="n">2 this week</span><span className="t"><i style={{ "--w": "5%" }}></i></span></li>
              <li className="hot"><span className="a">stackforge.m4x8d@ghstmail.space</span><span className="n">41 this week<button className="btn btn-quiet btn-burn" type="button">Burn it</button></span><span className="t"><i style={{ "--w": "100%" }}></i></span></li>
              <li><span className="a">nightowl.p2r9c@ghstmail.space</span><span className="n">1 this week</span><span className="t"><i style={{ "--w": "3%" }}></i></span></li>
            </ul>
          </article>

          <article className="tile b-reply">
            <h3>Reply as the alias</h3>
            <p>Hit reply in your own mail app. It goes out signed as the alias.</p>
            <div className="viz letter">
              <div><span>From</span><span style={{ color: "var(--amber)" }}>parcelbird.k7f2q@ghstmail.space</span></div>
              <div><span>To</span><span>help@parcelbird.example</span></div>
              <div><span>You</span><span className="hidden-addr">y••••@•••••.com, never shown</span></div>
            </div>
          </article>

          <article className="tile b-free">
            <svg aria-hidden="true"><use href="#ghost"/></svg>
            <div>
              <h3>All of it is free</h3>
              <p>Unlimited aliases, no card.</p>
              <Link href="/pricing">See pricing</Link>
            </div>
          </article>
        </div>
      </section>

        <section className="dev wrap" id="developers">
          <div className="dev-grid">
            <div>
              <h2>There is a CLI, and an API under it</h2>
              <p><code>ghstmail new github</code> creates an alias and puts it on your clipboard. The same account is available over REST with scoped API keys and an OpenAPI spec.</p>
              <p>The CLI does not phone home.</p>
              <div className="links">
                <Link className="btn btn-quiet btn-sm" href="/docs">Read the docs</Link>
                <a className="btn btn-text btn-sm" href="https://api.ghstmail.space/v1/openapi.json">OpenAPI spec</a>
              </div>
            </div>
            <div className="term">
              <div className="term-bar" role="tablist" aria-label="Example">
                <button role="tab" aria-selected="true" data-term="cli">cli</button>
                <button role="tab" aria-selected="false" data-term="curl">curl</button>
              </div>
      <pre id="term-cli" dangerouslySetInnerHTML={{ __html: CLI_SAMPLE }} />
      <pre id="term-curl" hidden dangerouslySetInnerHTML={{ __html: CURL_SAMPLE }} />
            </div>
          </div>
        </section>

        <section className="band ledger" id="privacy">
          <div className="wrap">
            <div className="ledger-head">
              <div>
                <h2>What we keep, and what we don't</h2>
                <p className="ledger-intro">A forwarding service has to know some things to work. This is the whole list, taken from the privacy policy.</p>
              </div>
              <Link className="btn btn-quiet btn-sm" href="/privacy">Read the privacy policy</Link>
            </div>
            <div className="ledger-grid">
              <article className="vault">
                <header>
                  <span className="vault-icon"><Glyph d={GLYPHS.box} /></span>
                  <div>
                    <h3>Kept</h3>
                    <p>What forwarding needs, and for how long.</p>
                  </div>
                </header>
                <ul>
                  <li><Glyph d={GLYPHS.mail} /><div><b>Your real email address</b><small>It is where your aliases forward to.</small></div><em>until you delete your account</em></li>
                  <li><Glyph d={GLYPHS.tag} /><div><b>Your aliases, their labels, and two counters</b><small>How many emails each one received and forwarded.</small></div><em>until you delete them</em></li>
                  <li><Glyph d={GLYPHS.reply} /><div><b>The address of anyone who emails an alias</b><small>So your reply can reach them.</small></div><em>until the alias is deleted</em></li>
                  <li><Glyph d={GLYPHS.thread} /><div><b>Message-IDs of forwarded mail</b><small>So replies thread properly in your mail app.</small></div><em>until the alias is deleted</em></li>
                  <li><Glyph d={GLYPHS.server} /><div><b>Server logs for fixing delivery and stopping abuse</b><small>Sender and recipient addresses and the connecting server&apos;s IP. Never content or subject lines.</small></div></li>
                </ul>
              </article>
              <article className="vault never">
                <header>
                  <span className="vault-icon"><Glyph d={GLYPHS.none} /></span>
                  <div>
                    <h3>Never kept</h3>
                    <p>What a forwarder could take, and we don't.</p>
                  </div>
                </header>
                <ul>
                  <li><Glyph d={GLYPHS.none} /><div><b>Message bodies and subject lines</b><small>Mail is processed in memory, forwarded and discarded. It never touches our database or disk.</small></div></li>
                  <li><Glyph d={GLYPHS.none} /><div><b>Your browsing history or web activity</b></div></li>
                  <li><Glyph d={GLYPHS.none} /><div><b>Analytics, fingerprints, telemetry</b></div></li>
                  <li><Glyph d={GLYPHS.none} /><div><b>Tracking or advertising cookies</b></div></li>
                  <li><Glyph d={GLYPHS.none} /><div><b>Your password or API keys in readable form</b><small>Stored only as hashes, so we cannot read them back.</small></div></li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="close">
          <div className="wrap">
            <h2>The next site that asks for your email gets a ghost.</h2>
            <p>Unlimited aliases, anonymous replies, filters and the Chrome extension are all on the free plan.</p>
            <Link className="btn btn-primary" href="/register">Create free account</Link>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <a className="brand" href="#top" style={{ fontSize: "1rem" }}><svg aria-hidden="true" style={{ width: 20, height: 20 }}><use href="#ghost"/></svg>GhstMail</a>
          <Link href="/docs">Docs</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/changelog">Changelog</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/refunds">Refunds</Link>
          <a href="mailto:support@ghstmail.space">Support</a>
          <span className="end">&copy; {new Date().getFullYear()} GhstMail</span>
        </div>
      </footer>
    </div>
  );
}
