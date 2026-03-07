"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { clearToken } from "../../lib/api";

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
    <div className="min-h-screen">
      <nav className="border-b border-void-600/20 backdrop-blur-md bg-void-950/80 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <svg className="w-5 h-5 text-phantom-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C7.58 2 4 5.58 4 10v9a1 1 0 001.7.7L7.4 18l1.7 1.7a1 1 0 001.4 0L12 18.2l1.5 1.5a1 1 0 001.4 0L16.6 18l1.7 1.7A1 1 0 0020 19v-9c0-4.42-3.58-8-8-8z" />
                <circle cx="9" cy="10" r="1.5" fill="currentColor" />
                <circle cx="15" cy="10" r="1.5" fill="currentColor" />
              </svg>
              <span className="font-display font-bold tracking-tight">GhstMail</span>
            </Link>

            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? "bg-phantom-400/10 text-phantom-400"
                        : "text-void-300 hover:text-void-50 hover:bg-void-700/30"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-void-400 hover:text-void-100 transition-colors"
          >
            <LogoutIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
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
