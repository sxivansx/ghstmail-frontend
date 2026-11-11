"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, setToken } from "@/lib/api";
import { safeNextPath } from "@/lib/utils";
import { AuthShell } from "@/components/auth-shell";

// Where Google and GitHub sign-in land. The backend has set its session
// cookie by now; this trades it for the token the dashboard uses.
export default function AuthCompletePage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .exchangeSession()
      .then((data) => {
        setToken(data.token);
        router.replace(safeNextPath("/dashboard"));
      })
      .catch(() => setError("The sign-in did not finish. Start it again from the sign-in page."));
  }, [router]);

  if (error) {
    return (
      <AuthShell title="Could not sign you in" subtitle={error}>
        <p className="text-center text-sm">
          <Link href="/login" className="text-primary hover:underline font-medium">
            Back to sign in
          </Link>
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Signing you in">
      <div className="flex justify-center" role="status" aria-label="Signing you in">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    </AuthShell>
  );
}
