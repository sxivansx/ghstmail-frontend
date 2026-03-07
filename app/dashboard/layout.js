"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clearToken } from "../../lib/api";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("ghstmail_token")) {
      router.replace("/login");
    }
  }, [router]);

  function handleLogout() {
    clearToken();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold">GhstMail</span>
          <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white">
            Aliases
          </Link>
          <Link href="/dashboard/filters" className="text-sm text-gray-300 hover:text-white">
            Filters
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-white"
        >
          Sign out
        </button>
      </nav>
      <main className="max-w-4xl mx-auto p-6">{children}</main>
    </div>
  );
}
