import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/pricing",
  title: "Pricing",
  description: "GhstMail is free forever. Unlimited aliases, anonymous replies, spam filters, and Chrome extension included.",
});

function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

const features = [
  "Unlimited email aliases",
  "Anonymous replies",
  "Smart domain filters",
  "Self-destructing aliases",
  "Chrome extension",
  "No ads, no tracking",
  "DKIM-signed forwarding",
  "TLS encryption",
];

const link = "text-primary hover:underline";

// Plain answers to what people search for before signing up. Every claim is
// also made on the home page or in the privacy policy; keep them in step.
// Nothing here is about price, so it stays true when paid plans launch.
const questions = [
  {
    q: "What is an email alias?",
    a: (
      <>
        An address you give out instead of your real one, like <span className="font-mono text-[0.9em] text-foreground">netflix.k7f2q@ghstmail.space</span>. Mail sent to it is forwarded to your real inbox, and the site that has it never learns your actual address. You can make a different alias for every site you sign up for.
      </>
    ),
  },
  {
    q: "How is this different from a temporary inbox?",
    a: "A temporary inbox lives on someone else's website and disappears after a while, so later emails like password resets and receipts are lost. Many are shared, so anyone who knows the address can read them. A GhstMail alias delivers to your own inbox for as long as you keep it, and you can reply from it. If you do want a throwaway, set the alias to expire.",
  },
  {
    q: "Can I reply without showing my real address?",
    a: "Yes. Reply from your own mail app as usual. The reply goes out from the alias, so the person you write to only ever sees the alias.",
  },
  {
    q: "Does GhstMail read or keep my email?",
    a: (
      <>
        No. Each message is processed in memory, forwarded and discarded. The body, attachments and subject line never touch our database or disk. To make replies work we keep the address of whoever wrote to each alias, and our servers keep short-lived logs. The{" "}
        <Link href="/privacy" className={link}>privacy policy</Link> lists everything.
      </>
    ),
  },
  {
    q: "What do I do when an alias starts getting spam?",
    a: "Turn it off and the mail stops. Because each site has its own alias, you also know which site leaked it. To stop a sender everywhere, block their domain: one rule covers every alias you have.",
  },
  {
    q: "Does it work with Gmail, Outlook or iCloud?",
    a: "Yes. Aliases forward to the address on your account, whichever provider it is with, and you reply from the mail app you already use.",
  },
  {
    q: "Do I need the Chrome extension?",
    a: (
      <>
        No. You can make aliases from the dashboard, the command line tool or the{" "}
        <Link href="/docs" className={link}>API</Link>. The extension saves a step: it adds a button to email fields that makes an alias named after the site and fills it in.
      </>
    ),
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen relative">
      <SiteHeader />
      <div className="max-w-[1180px] mx-auto relative">
        <main className="">
          <section className="pt-24 pb-20 px-6">
            <div className="max-w-lg mx-auto text-center">
              <Badge variant="secondary">Pricing</Badge>
              <h1 className="mt-4 font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
                Free. <span className="text-primary text-glow">Forever.</span>
              </h1>
              <p className="mt-4 text-muted-foreground text-base max-w-md mx-auto">
                No tiers. No credit card. No catch. Everything is included.
              </p>

              <Card className="mt-10 p-8 border-primary/20 bg-card/50 backdrop-blur-sm text-left">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="font-display font-extrabold text-5xl">$0</span>
                  <span className="text-muted-foreground text-sm">/ forever</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <CheckIcon className="w-4 h-4 text-primary shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full glow-primary-strong" size="lg" asChild>
                  <Link href="/register">
                    Create free account
                    <ArrowIcon />
                  </Link>
                </Button>
              </Card>

              <p className="mt-6 text-xs text-muted-foreground">
                Questions? Reach us at{" "}
                <a href="mailto:privacy@ghstmail.space" className="text-primary hover:underline">
                  privacy@ghstmail.space
                </a>
              </p>
            </div>
          </section>

          <section aria-labelledby="questions" className="px-6 pb-24">
            <div className="max-w-2xl mx-auto">
              <h2 id="questions" className="font-display font-bold text-[1.85rem] tracking-tight">Common questions</h2>
              <div className="mt-6">
                {questions.map(({ q, a }) => (
                  <div key={q} className="border-t border-border/60 py-6">
                    <h3 className="font-display font-semibold text-[1.1rem] text-foreground">{q}</h3>
                    <p className="mt-2 text-[15px] leading-[1.75] text-muted-foreground">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
