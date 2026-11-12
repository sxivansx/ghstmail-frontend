import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

// The frame shared by the privacy policy, terms and refund policy.
export function LegalPage({ title, updated, children }) {
  return (
    <div className="min-h-screen relative">
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display font-bold text-3xl mb-2">{title}</h1>
        <p className="text-muted-foreground text-sm mb-10">Last updated: {updated}</p>
        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">{children}</div>
        <nav aria-label="Legal" className="mt-12 pt-6 border-t border-border/50 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link>
          <Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link>
          <Link href="/refunds" className="text-muted-foreground hover:text-foreground">Refund Policy</Link>
          <a href="mailto:support@ghstmail.space" className="text-muted-foreground hover:text-foreground">support@ghstmail.space</a>
        </nav>
      </main>
    </div>
  );
}

export function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-foreground font-semibold text-lg mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
