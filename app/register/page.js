"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, setToken } from "../../lib/api";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { safeNextPath } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { SocialSignIn } from "@/components/social-sign-in";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Preserve ?next= across the login/register hop.
  const [nextSuffix, setNextSuffix] = useState("");
  const [nextPath, setNextPath] = useState("");
  useEffect(() => {
    const n = new URLSearchParams(window.location.search).get("next");
    if (n) {
      setNextPath(n);
      setNextSuffix(`?next=${encodeURIComponent(n)}`);
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.register(email, password);
      setToken(data.token);
      router.push(safeNextPath("/dashboard"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Outer container with vertical guide lines */}
      <div className="max-w-[1180px] mx-auto w-full flex-1 flex flex-col relative">
        {/* Vertical guide lines */}

        {/* Floating header bar */}
        <SiteHeader />


        <main className="flex-1 flex items-center justify-center px-4 pb-16">
          <div className="w-full max-w-sm">
            <div className="opacity-0 animate-fade-up text-center mb-8">
              <h1 className="font-display font-bold text-3xl tracking-tight">Go invisible</h1>
              <p className="text-muted-foreground mt-2 text-sm">Create your free GhstMail account in seconds</p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
                <span>Unlimited aliases</span>
                <span className="text-border">|</span>
                <span>Anonymous replies</span>
                <span className="text-border">|</span>
                <span>Spam filters</span>
                <span className="text-border">|</span>
                <span>Chrome extension</span>
              </div>
            </div>

            <Card className="opacity-0 animate-fade-up-delay-1 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6 space-y-4">
                <SocialSignIn nextPath={nextPath} />
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="px-4 py-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      placeholder="Min. 8 characters"
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full glow-primary">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Creating account...
                      </span>
                    ) : "Create free account"}
                  </Button>
                  <p className="text-center text-[11px] text-muted-foreground mt-3">
                    By signing up, you agree to our{" "}
                    <Link href="/privacy" className="text-muted-foreground hover:text-foreground underline underline-offset-2">
                      Privacy Policy
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>

            <p className="opacity-0 animate-fade-up-delay-2 text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link href={`/login${nextSuffix}`} className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
