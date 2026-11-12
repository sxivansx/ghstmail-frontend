"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, setToken } from "../../lib/api";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { PeekingGhost } from "@/components/peeking-ghost";
import { safeNextPath } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { SocialSignIn, socialSignInError } from "@/components/social-sign-in";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Preserve ?next= across the login/register hop.
  const [nextSuffix, setNextSuffix] = useState("");
  const [nextPath, setNextPath] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const n = params.get("next");
    if (n) {
      setNextPath(n);
      setNextSuffix(`?next=${encodeURIComponent(n)}`);
    }
    // Set by the backend when a Google or GitHub sign-in fails.
    setError(socialSignInError(params.get("error")));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login(email, password);
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
        <SiteHeader />

        <main className="flex-1 flex items-center justify-center px-4 pb-16">
          <div className="w-full max-w-sm">
            <div className="opacity-0 animate-fade-up text-center mb-14">
              <h1 className="font-display font-bold text-3xl tracking-tight">Welcome back</h1>
            </div>

            <div className="relative">
              <PeekingGhost />
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
                        placeholder="Enter your password"
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full glow-primary">
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Signing in...
                        </span>
                      ) : "Sign in"}
                    </Button>
                    <div className="text-center mt-3">
                      <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                        Forgot your password?
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            <p className="opacity-0 animate-fade-up-delay-2 text-center text-sm text-muted-foreground mt-6">
              Don&apos;t have an account?{" "}
              <Link href={`/register${nextSuffix}`} className="text-primary hover:underline font-medium">
                Create one
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
