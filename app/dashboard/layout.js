"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { clearToken } from "../../lib/api";
import { Button } from "@/components/ui/button";

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
      router.replace("/login");
    }
  }, [router]);

  function handleLogout() {
    clearToken();
    router.replace("/");
  }

  const navItems = [
    { href: "/dashboard", label: "Aliases", icon: MailIcon },
    { href: "/dashboard/filters", label: "Filters", icon: FilterIcon },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Outer container with vertical guide lines */}
      <div className="max-w-7xl mx-auto relative">
        {/* Vertical guide lines */}
        <div className="absolute top-0 left-0 h-full w-px bg-border/50" />
        <div className="absolute top-0 right-0 h-full w-px bg-border/50" />

        {/* Floating nav bar */}
        <div className="px-4 pt-4 sticky top-0 z-50">
          <nav className="bg-muted/50 border border-border rounded-2xl px-6 h-14 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="flex items-center gap-2">
                <GhostIcon className="w-5 h-5 text-primary" />
                <span className="font-display font-bold tracking-tight">GhstMail</span>
              </Link>

              <div className="flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Button
                      key={item.href}
                      variant={active ? "secondary" : "ghost"}
                      size="sm"
                      asChild
                    >
                      <Link href={item.href} className="gap-2">
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground">
              <LogoutIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </nav>
        </div>

        {/* Main content inside border-x */}
        <div className="border-x border-border/50 mt-2">
          <main role="main" className="max-w-6xl mx-auto px-6 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
