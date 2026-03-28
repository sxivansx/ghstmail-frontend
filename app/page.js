"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function GhostIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C7.58 2 4 5.58 4 10v9a1 1 0 001.7.7L7.4 18l1.7 1.7a1 1 0 001.4 0L12 18.2l1.5 1.5a1 1 0 001.4 0L16.6 18l1.7 1.7A1 1 0 0020 19v-9c0-4.42-3.58-8-8-8z" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <circle cx="15" cy="10" r="1.5" fill="currentColor" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-4 h-4 ml-1 group-hover/button:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function HatchingDivider({ className = "h-8" }) {
  return (
    <div className={`relative self-stretch overflow-hidden ${className}`}>
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <div className="relative h-full w-full">
          {Array.from({ length: 300 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-4 w-full origin-top-left -rotate-45"
              style={{
                top: `${i * 16 - 120}px`,
                left: "-100%",
                width: "300%",
                outline: "0.5px solid hsl(var(--primary) / 0.12)",
                outlineOffset: "-0.25px",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: "Instant Aliases",
    desc: "One click, new address. Use it anywhere — signups, newsletters, trials. Emails land in your real inbox.",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 17 4 12 9 7" />
        <path d="M20 18v-2a4 4 0 00-4-4H4" />
      </svg>
    ),
    title: "Anonymous Replies",
    desc: "Hit reply like normal. The sender sees only your alias — your real email is never revealed.",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>
    ),
    title: "Smart Filters",
    desc: "Getting spam from a domain? Block it in one click. You control exactly what reaches your inbox.",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Self-Destructing Aliases",
    desc: "Need an address for just a day? Set a timer and it expires on its own. No cleanup required.",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("ghstmail_token");
    if (token) {
      router.replace("/dashboard");
      return;
    }
    setLoaded(true);
  }, [router]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Outer container with vertical guide lines */}
      <div className="max-w-7xl mx-auto relative">
        {/* Vertical guide lines */}
        <div className="absolute top-0 left-0 h-full w-px bg-border/50" />
        <div className="absolute top-0 right-0 h-full w-px bg-border/50" />

        {/* Floating header bar */}
        <header className="px-4 pt-4">
          <div className="bg-muted/50 border border-border rounded-2xl px-6 h-14 flex items-center justify-between backdrop-blur-sm">
            <Link href="/" className="flex items-center gap-2.5">
              <GhostIcon className="w-7 h-7 text-primary" />
              <span className="font-display font-bold text-lg tracking-tight">GhstMail</span>
            </Link>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">
                  Get Started
                  <ArrowIcon />
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Hatching divider after header */}
        <HatchingDivider className="h-6" />

        <main>
        {/* Hero — inside border-x */}
        <div className="border-x border-border/50">
          <section className="pt-40 pb-16 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="opacity-0 animate-fade-up">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-8 tracking-wide uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-glow-pulse" />
                  Privacy-first email forwarding
                </div>
              </div>

              <h1 className="opacity-0 animate-fade-up-delay-1 font-display font-extrabold text-5xl sm:text-6xl md:text-7xl tracking-tight leading-[1.05]">
                Your email.{" "}
                <span className="text-primary text-glow">Invisible.</span>
              </h1>

              <p className="opacity-0 animate-fade-up-delay-2 mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
                Generate disposable email aliases that forward to your real inbox.
                Reply anonymously. Block unwanted senders. Your real address stays hidden.
              </p>

              <p className="opacity-0 animate-fade-up-delay-2 mt-4 text-sm text-foreground/60">
                Free forever &middot; No credit card &middot; Set up in seconds
              </p>

              <div className="opacity-0 animate-fade-up-delay-3 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="glow-primary-strong text-base px-8 h-12" asChild>
                  <Link href="/register">
                    Create free account
                    <ArrowIcon />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-base px-8 h-12" asChild>
                  <Link href="/login">I have an account</Link>
                </Button>
              </div>

              {/* Chrome Extension pill */}
              <div className="opacity-0 animate-fade-up-delay-3 mt-6">
                <a
                  href="https://chromewebstore.google.com/detail/ghstmail/ejnaojhagohicodfhmgehnhmmahjohbj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-primary/25 bg-primary/[0.08] hover:bg-primary/15 hover:border-primary/40 text-sm text-foreground/80 hover:text-foreground transition-all group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/chrome.svg" alt="Chrome" className="w-[18px] h-[18px]" />
                  Get the Chrome extension
                  <ArrowIcon />
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Hatching divider */}
        <HatchingDivider />

        {/* How it works — border-y section */}
        <div className="border-x border-border/50">
          <section className="border-y border-border/50 py-20 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <Badge variant="secondary">How It Works</Badge>
                <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold tracking-tight">
                  Private email in three steps
                </h2>
                <p className="mt-3 text-muted-foreground text-base max-w-lg mx-auto">
                  Three steps to complete email privacy. No complex setup.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { step: "01", title: "Generate", desc: "Create a unique alias address in one click from the dashboard or Chrome extension.", hasExtLink: true },
                  { step: "02", title: "Receive", desc: "Someone emails your alias — it lands in your real inbox instantly. They never see your real address." },
                  { step: "03", title: "Reply", desc: "Hit reply like normal. Your response goes out from the alias. Two-way conversation, zero exposure." },
                ].map((item) => (
                  <Card key={item.step} className="relative p-6 group bg-card/50 ring-0 border border-border/50 hover:border-primary/30 hover:shadow-[0_0_20px_hsl(var(--primary)/0.08)] transition-all duration-300">
                    <span className="font-display font-extrabold text-5xl text-primary/10 absolute top-4 right-5 group-hover:text-primary/20 transition-colors">
                      {item.step}
                    </span>
                    <div className="relative">
                      <h3 className="font-display font-bold text-xl mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.hasExtLink
                          ? <>Create a unique alias address in one click from the dashboard or{" "}
                              <a href="https://chromewebstore.google.com/detail/ghstmail/ejnaojhagohicodfhmgehnhmmahjohbj" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary">Chrome extension</a>.
                            </>
                          : item.desc}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Hatching divider */}
        <HatchingDivider />

        {/* Features — border-x with badge */}
        <div className="border-x border-border/50">
          <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <Badge variant="secondary">Features</Badge>
                <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold tracking-tight">
                  Privacy without compromises
                </h2>
                <p className="mt-3 text-muted-foreground text-base max-w-lg mx-auto">
                  Everything you need to keep your real email hidden.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((f) => (
                  <Card key={f.title} className="p-6 group bg-card/50 ring-0 border border-border/50 hover:border-primary/30 hover:shadow-[0_0_20px_hsl(var(--primary)/0.08)] transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/15 transition-colors">
                      {f.icon}
                    </div>
                    <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Hatching divider */}
        <HatchingDivider />

        {/* Why GhstMail section */}
        <div className="border-x border-border/50">
          <section className="border-y border-border/50 py-20 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-14">
                <Badge variant="secondary">Why GhstMail</Badge>
                <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold tracking-tight">
                  Not just another temp mail
                </h2>
                <p className="mt-3 text-muted-foreground text-base max-w-lg mx-auto">
                  Most disposable email services let you receive. We let you live behind the alias.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 17 4 12 9 7" />
                        <path d="M20 18v-2a4 4 0 00-4-4H4" />
                      </svg>
                    ),
                    title: "Two-way anonymity",
                    desc: "Most temp mail is receive-only. GhstMail lets you reply from your alias — full conversations without ever exposing your real address.",
                    highlight: "Reply, not just receive.",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    ),
                    title: "Aliases that expire on your terms",
                    desc: "Need a throwaway address for 24 hours? Set a timer. It self-destructs when you\u2019re done. No leftover mess, no manual cleanup.",
                    highlight: "Set it and forget it.",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                      </svg>
                    ),
                    title: "Truly zero knowledge",
                    desc: "We don\u2019t store your emails, run analytics, set cookies, or fingerprint your browser. Other services say \u201Cprivacy-first\u201D while tracking usage. We don\u2019t.",
                    highlight: "Privacy by architecture, not policy.",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <path d="M8 21h8" /><path d="M12 17v4" />
                      </svg>
                    ),
                    title: "Generate aliases anywhere",
                    desc: "The Chrome extension detects email fields on any website and lets you create an alias without leaving the page. No tab-switching, no copy-pasting.",
                    highlight: "Right where you need it.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-5 group">
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mt-0.5 group-hover:bg-primary/15 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                      <p className="text-primary text-xs font-medium mt-2">{item.highlight}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Hatching divider */}
        <HatchingDivider />

        {/* Security / Trust section */}
        <div className="border-x border-border/50">
          <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <Badge variant="secondary">Security</Badge>
                <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold tracking-tight">
                  Your data, protected
                </h2>
                <p className="mt-3 text-muted-foreground text-base max-w-lg mx-auto">
                  Your emails pass through — never stored, never read, never tracked.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                    ),
                    title: "Zero email storage",
                    desc: "Your emails pass through our servers and are immediately forwarded. Nothing is saved, logged, or read.",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    ),
                    title: "Encrypted by default",
                    desc: "Bcrypt-hashed passwords, TLS on every connection, and DKIM-signed forwarding. Security isn\u2019t optional.",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                      </svg>
                    ),
                    title: "No tracking. Period.",
                    desc: "Zero analytics. Zero cookies. Zero telemetry. We have no idea what you do online — and we want to keep it that way.",
                  },
                ].map((item) => (
                  <Card key={item.title} className="p-6 group bg-card/50 ring-0 border border-border/50 hover:border-primary/30 hover:shadow-[0_0_20px_hsl(var(--primary)/0.08)] transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/15 transition-colors">
                      {item.icon}
                    </div>
                    <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Hatching divider */}
        <HatchingDivider />

        {/* CTA — radial gradient background */}
        <div className="border-x border-border/50">
          <section
            className="py-24 px-6 relative overflow-hidden"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 50% 50%, hsl(var(--primary) / 0.10) 0%, transparent 70%),
                repeating-conic-gradient(hsl(var(--primary) / 0.03) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px
              `,
            }}
          >
            <div className="max-w-2xl mx-auto text-center relative z-10">
              <Badge variant="secondary">Get Started</Badge>
              <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold tracking-tight">
                Ready to go <span className="text-primary">invisible</span>?
              </h2>
              <p className="mt-4 text-muted-foreground text-base">Create your first alias in under a minute. No credit card needed.</p>
              <Button size="lg" className="mt-8 glow-primary-strong text-base px-8 h-12" asChild>
                <Link href="/register">
                  Get started now
                  <ArrowIcon />
                </Link>
              </Button>
            </div>
          </section>
        </div>

        {/* Hatching divider */}
        <HatchingDivider className="h-6" />
        </main>

        {/* Footer — multi-column */}
        <footer className="border-x border-border/50 border-t border-border/50 py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <GhostIcon className="w-5 h-5 text-primary" />
                  <span className="font-display font-bold tracking-tight">GhstMail</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Privacy-first email aliases. Stay invisible.
                </p>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Product</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/register" className="hover:text-foreground transition-colors">Get Started</Link></li>
                  <li><Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link></li>
                  <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                  <li><a href="https://chromewebstore.google.com/detail/ghstmail/ejnaojhagohicodfhmgehnhmmahjohbj" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Chrome Extension</a></li>
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Resources</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><span className="text-muted-foreground/50">Documentation <span className="text-[10px]">(soon)</span></span></li>
                  <li><span className="text-muted-foreground/50">API <span className="text-[10px]">(soon)</span></span></li>
                  <li><a href="mailto:privacy@ghstmail.space" className="hover:text-foreground transition-colors">Support</a></li>
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Legal</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                  <li><span className="text-muted-foreground/50">Terms of Service <span className="text-[10px]">(soon)</span></span></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border/50 pt-6 flex items-center justify-between text-xs text-muted-foreground">
              <span>&copy; {new Date().getFullYear()} GhstMail</span>
              <span>Privacy-first email aliases</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
