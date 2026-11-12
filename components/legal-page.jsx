import { Children } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SectionNav } from "@/components/section-nav";
import { sectionId } from "@/lib/docs-format";

// The frame shared by the privacy policy, terms and refund policy. The sidebar is
// built from the titles of the Section children, so pages only list their sections.
export function LegalPage({ title, updated, lede, children }) {
  const items = Children.toArray(children)
    .filter((child) => child.props?.title)
    .map((child) => ({ id: sectionId(child.props.title), label: child.props.title }));

  return (
    <div className="min-h-screen relative">
      <SiteHeader />
      <main className="max-w-[1180px] mx-auto px-5 sm:px-10">
        <header className="relative pt-14 pb-12 lg:pt-20 lg:pb-16">
          <div aria-hidden="true" className="pointer-events-none absolute -z-10 inset-x-0 -top-16 h-[420px] bg-[radial-gradient(closest-side_at_30%_50%,hsl(var(--primary)/0.1),transparent)]" />
          <h1 className="font-display font-extrabold tracking-tight leading-[0.98] text-[clamp(2.4rem,5vw,4rem)]">{title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated {updated}</p>
          {lede && (
            <p className="mt-9 max-w-[44em] rounded-2xl border border-border bg-card p-6 text-[17px] leading-relaxed text-foreground/90">
              {lede}
            </p>
          )}
        </header>

        <div className="pb-16 lg:flex lg:gap-14">
          <SectionNav items={items} />
          <div className="min-w-0 flex-1 max-w-[44em]">
            <div className="text-[15px] leading-[1.75] text-muted-foreground [&_li]:marker:text-primary/70">{children}</div>
            <nav aria-label="Legal" className="mt-4 pt-7 border-t border-border/60 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/refunds" className="text-muted-foreground hover:text-foreground transition-colors">Refund Policy</Link>
              <a href="mailto:support@ghstmail.space" className="text-muted-foreground hover:text-foreground transition-colors">support@ghstmail.space</a>
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
}

export function Section({ title, children }) {
  return (
    <section id={sectionId(title)} className="scroll-mt-24 border-t border-border/60 py-9 first:border-t-0 first:pt-0">
      <h2 className="font-display font-bold text-[1.45rem] tracking-tight text-foreground mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
