import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { releases, formatReleaseDate } from "@/lib/changelog";

export const metadata = {
  title: "Changelog",
  description: "What has changed in GhstMail, newest first.",
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen relative">
      <SiteHeader />
      <main className="max-w-[1180px] mx-auto px-5 sm:px-10">
        <header className="relative pt-14 pb-12 lg:pt-20 lg:pb-16">
          <div aria-hidden="true" className="pointer-events-none absolute -z-10 inset-x-0 -top-16 h-[420px] bg-[radial-gradient(closest-side_at_30%_50%,hsl(var(--primary)/0.1),transparent)]" />
          <h1 className="font-display font-extrabold tracking-tight leading-[0.98] text-[clamp(2.4rem,5vw,4rem)]">Changelog</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground max-w-[34em]">
            What has changed in GhstMail, newest first. If something here broke the way you work,{" "}
            <a href="mailto:support@ghstmail.space" className="text-foreground underline underline-offset-4 decoration-border hover:decoration-primary">
              tell us
            </a>
            .
          </p>
        </header>

        <ol className="pb-10">
          {releases.map((release) => (
            <li key={release.date} className="grid gap-x-12 gap-y-4 border-t border-border/60 py-12 md:grid-cols-[168px_minmax(0,1fr)]">
              <div className="md:sticky md:top-24 md:self-start">
                <time dateTime={release.date} className="font-mono text-[13px] text-muted-foreground">
                  {formatReleaseDate(release.date)}
                </time>
              </div>

              <article className="max-w-[44em]">
                <h2 className="font-display font-bold tracking-tight leading-tight text-[clamp(1.5rem,2.6vw,2rem)]">{release.title}</h2>
                <p className="mt-3 text-[17px] leading-relaxed text-muted-foreground">{release.summary}</p>

                <div className="mt-8 space-y-8">
                  {release.changes.map((group) => (
                    <section key={group.area}>
                      <h3 className="inline-flex items-center h-6 px-2.5 rounded-md border border-border bg-card text-xs text-foreground">
                        {group.area}
                      </h3>
                      <ul className="mt-3.5 space-y-2.5 text-[15px] leading-relaxed text-muted-foreground">
                        {group.items.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span aria-hidden="true" className="mt-[0.62em] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </article>
            </li>
          ))}
        </ol>

        <nav aria-label="More" className="mb-16 pt-7 border-t border-border/60 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">API reference</Link>
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
        </nav>
      </main>
    </div>
  );
}
