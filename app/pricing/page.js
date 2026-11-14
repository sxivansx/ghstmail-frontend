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
        </main>
      </div>
    </div>
  );
}
