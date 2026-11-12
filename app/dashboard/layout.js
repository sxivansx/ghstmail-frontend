"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { clearToken } from "../../lib/api";

function GhostIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C7.58 2 4 5.58 4 10v9a1 1 0 001.7.7L7.4 18l1.7 1.7a1 1 0 001.4 0L12 18.2l1.5 1.5a1 1 0 001.4 0L16.6 18l1.7 1.7A1 1 0 0020 19v-9c0-4.42-3.58-8-8-8z" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <circle cx="15" cy="10" r="1.5" fill="currentColor" />
    </svg>
  );
}

function MailIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 7L2 7" />
    </svg>
  );
}

function FilterIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function KeyIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="4.5" />
      <path d="M10.7 12.3L21 2m-4 0h4v4" />
    </svg>
  );
}

function CardIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function BookIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}

function LogoutIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!localStorage.getItem("ghstmail_token")) {
      // Carry where they were trying to go, so signing in returns them there
      // instead of dumping everyone on /dashboard.
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      router.replace(`/login?next=${next}`);
    }
  }, [router]);

  function handleLogout() {
    clearToken();
    router.replace("/");
  }

  const navItems = [
    { href: "/dashboard", label: "Aliases", icon: MailIcon },
    { href: "/dashboard/filters", label: "Filters", icon: FilterIcon },
    { href: "/dashboard/keys", label: "API keys", icon: KeyIcon },
    // Hidden until paid plans launch, so the live dashboard doesn't change.
    ...(process.env.NEXT_PUBLIC_BILLING_ENABLED === "true"
      ? [{ href: "/dashboard/billing", label: "Billing", icon: CardIcon }]
      : []),
  ];

  const linkTone = (active) =>
    active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted";

  return (
    <div className="dashboard-neutral min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[232px_minmax(0,1fr)]">
      {/* Sidebar, desktop */}
      <aside className="hidden lg:flex flex-col sticky top-0 h-screen border-r border-border bg-card/40 px-3 py-4">
        <Link href="/dashboard" className="flex items-center gap-2.5 px-3 h-10 mb-5">
          <GhostIcon className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-lg tracking-tight">GhstMail</span>
        </Link>
        <nav aria-label="Dashboard" className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex items-center gap-3 px-3 h-9 rounded-lg text-sm transition-colors ${linkTone(active)} ${active ? "before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:rounded-full before:bg-primary" : ""}`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-primary" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-0.5 border-t border-border pt-3">
          <Link href="/docs" className={`flex items-center gap-3 px-3 h-9 rounded-lg text-sm transition-colors ${linkTone(false)}`}>
            <BookIcon className="w-4 h-4" />
            API docs
          </Link>
          <button onClick={handleLogout} className={`flex items-center gap-3 px-3 h-9 rounded-lg text-sm text-left transition-colors ${linkTone(false)}`}>
            <LogoutIcon className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        {/* Top bar, phones and tablets */}
        <header className="lg:hidden sticky top-0 z-40 flex items-center gap-1 h-14 px-4 border-b border-border bg-background/85 backdrop-blur-md">
          <Link href="/dashboard" className="flex items-center gap-2 mr-auto">
            <GhostIcon className="w-6 h-6 text-primary" />
            <span className="font-display font-bold tracking-tight">GhstMail</span>
          </Link>
          <nav aria-label="Dashboard" className="flex items-center gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 px-2.5 h-9 rounded-lg text-sm transition-colors ${linkTone(active)}`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-primary" : ""}`} />
                  {/* Icons only on phones, so the bar fits; the label stays for screen readers. */}
                  <span className="sr-only sm:not-sr-only">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <button onClick={handleLogout} title="Sign out" className={`flex items-center px-2.5 h-9 rounded-lg transition-colors ${linkTone(false)}`}>
            <LogoutIcon className="w-4 h-4" />
            <span className="sr-only">Sign out</span>
          </button>
        </header>

        <main role="main" className="max-w-[1080px] mx-auto px-5 sm:px-8 py-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
