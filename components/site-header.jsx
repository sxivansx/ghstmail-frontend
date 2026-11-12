import Link from "next/link";

function GhostIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2C7.58 2 4 5.58 4 10v9a1 1 0 001.7.7L7.4 18l1.7 1.7a1 1 0 001.4 0L12 18.2l1.5 1.5a1 1 0 001.4 0L16.6 18l1.7 1.7A1 1 0 0020 19v-9c0-4.42-3.58-8-8-8z" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <circle cx="15" cy="10" r="1.5" fill="currentColor" />
    </svg>
  );
}

const links = [
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/privacy", label: "Privacy" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="max-w-[1180px] mx-auto h-16 px-5 sm:px-10 flex items-center gap-7">
        <Link href="/" className="flex items-center gap-2.5 font-display font-bold text-lg tracking-tight">
          <GhostIcon className="w-[26px] h-[26px] text-primary" />
          GhstMail
        </Link>
        <nav aria-label="Main" className="hidden sm:flex items-center gap-6 text-[15px]">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/login" className="px-3 h-[38px] inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
            Log in
          </Link>
          <Link href="/register" className="hidden sm:inline-flex h-[38px] items-center rounded-[9px] bg-primary px-4 text-[15px] font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            Create free account
          </Link>
        </div>
      </div>
    </header>
  );
}
