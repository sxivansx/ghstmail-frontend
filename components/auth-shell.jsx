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

// The frame the login and register pages use (header bar, bordered column),
// for the smaller account pages: password reset and finishing a sign-in.
export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col relative">
        <div className="absolute top-0 left-0 h-full w-px bg-border/50" />
        <div className="absolute top-0 right-0 h-full w-px bg-border/50" />

        <header className="px-4 pt-4">
          <div className="bg-muted/50 border border-border rounded-2xl px-6 h-14 flex items-center backdrop-blur-sm">
            <Link href="/" className="flex items-center gap-2.5 group">
              <GhostIcon className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-lg tracking-tight group-hover:text-primary transition-colors">GhstMail</span>
            </Link>
          </div>
        </header>

        <main className="border-x border-border/50 flex-1 flex items-center justify-center px-4 py-16 mt-6">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <h1 className="font-display font-bold text-3xl tracking-tight">{title}</h1>
              {subtitle && <p className="text-muted-foreground mt-2 text-sm">{subtitle}</p>}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
