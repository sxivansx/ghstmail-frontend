"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function GhostIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C7.58 2 4 5.58 4 10v9a1 1 0 001.7.7L7.4 18l1.7 1.7a1 1 0 001.4 0L12 18.2l1.5 1.5a1 1 0 001.4 0L16.6 18l1.7 1.7A1 1 0 0020 19v-9c0-4.42-3.58-8-8-8z" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <circle cx="15" cy="10" r="1.5" fill="currentColor" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function ReplyIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 17 4 12 9 7" />
      <path d="M20 18v-2a4 4 0 00-4-4H4" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

const features = [
  {
    icon: <ShieldIcon />,
    title: "Instant Aliases",
    desc: "Generate unique email addresses in one click. Each alias forwards directly to your real inbox.",
  },
  {
    icon: <ReplyIcon />,
    title: "Anonymous Replies",
    desc: "Reply to forwarded emails without exposing your real address. Your identity stays hidden.",
  },
  {
    icon: <FilterIcon />,
    title: "Smart Filters",
    desc: "Block unwanted senders by domain. Control exactly what reaches your inbox.",
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
        <div className="w-6 h-6 border-2 border-phantom-400/30 border-t-phantom-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-gradient">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-void-950/70 border-b border-void-600/20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <GhostIcon className="w-7 h-7 text-phantom-400" />
            <span className="font-display font-bold text-lg tracking-tight">GhstMail</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-void-100 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="group px-4 py-2 text-sm font-semibold bg-phantom-400 text-void-950 rounded-lg hover:bg-phantom-300 transition-all flex items-center"
            >
              Get Started
              <ArrowRight />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="opacity-0 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-phantom-400/20 bg-phantom-400/5 text-phantom-400 text-xs font-medium mb-8 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-phantom-400 animate-glow-pulse" />
              Privacy-first email forwarding
            </div>
          </div>

          <h1 className="opacity-0 animate-fade-up-delay-1 font-display font-extrabold text-5xl sm:text-6xl md:text-7xl tracking-tight leading-[1.05]">
            Your email.{" "}
            <span className="text-phantom-400 text-glow">Invisible.</span>
          </h1>

          <p className="opacity-0 animate-fade-up-delay-2 mt-6 text-lg sm:text-xl text-void-200 max-w-2xl mx-auto leading-relaxed font-light">
            Generate disposable aliases that forward to your inbox.
            Reply without revealing who you are. Block what you don&apos;t want.
          </p>

          <div className="opacity-0 animate-fade-up-delay-3 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group px-8 py-3.5 text-base font-semibold bg-phantom-400 text-void-950 rounded-xl hover:bg-phantom-300 transition-all glow-green-strong flex items-center"
            >
              Create free account
              <ArrowRight />
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 text-base font-medium text-void-100 border border-void-500 rounded-xl hover:border-void-400 hover:text-white transition-all"
            >
              I have an account
            </Link>
          </div>
        </div>
      </section>

      {/* How it works — visual flow */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
              How it works
            </h2>
            <p className="mt-3 text-void-300 text-base max-w-lg mx-auto">
              Three steps to complete email privacy. No complex setup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Generate", desc: "Create a unique alias address in one click from the dashboard or Chrome extension." },
              { step: "02", title: "Receive", desc: "Emails sent to your alias are forwarded to your real inbox. Sender sees only the alias." },
              { step: "03", title: "Reply", desc: "Hit reply as usual. Your response is sent from the alias — your real email stays hidden." },
            ].map((item) => (
              <div key={item.step} className="relative p-6 rounded-2xl border border-void-600/30 bg-void-800/30 backdrop-blur-sm border-glow group">
                <span className="font-display font-extrabold text-5xl text-phantom-400/10 absolute top-4 right-5 group-hover:text-phantom-400/20 transition-colors">
                  {item.step}
                </span>
                <div className="relative">
                  <h3 className="font-display font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-void-300 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-void-600/30 bg-void-800/20 backdrop-blur-sm border-glow group"
              >
                <div className="w-10 h-10 rounded-xl bg-phantom-400/10 border border-phantom-400/20 flex items-center justify-center text-phantom-400 mb-4 group-hover:bg-phantom-400/15 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-void-300 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
            Ready to go <span className="text-phantom-400">invisible</span>?
          </h2>
          <p className="mt-4 text-void-300 text-base">
            Free to use. No credit card. Takes 10 seconds.
          </p>
          <Link
            href="/register"
            className="group inline-flex items-center mt-8 px-8 py-3.5 text-base font-semibold bg-phantom-400 text-void-950 rounded-xl hover:bg-phantom-300 transition-all glow-green-strong"
          >
            Get started now
            <ArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-void-600/20 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-void-400">
          <div className="flex items-center gap-2">
            <GhostIcon className="w-4 h-4 text-phantom-400/60" />
            <span>GhstMail</span>
          </div>
          <span>Privacy-first email aliases</span>
        </div>
      </footer>
    </div>
  );
}
