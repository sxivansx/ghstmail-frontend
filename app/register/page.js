"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, setToken } from "../../lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

function GhostIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C7.58 2 4 5.58 4 10v9a1 1 0 001.7.7L7.4 18l1.7 1.7a1 1 0 001.4 0L12 18.2l1.5 1.5a1 1 0 001.4 0L16.6 18l1.7 1.7A1 1 0 0020 19v-9c0-4.42-3.58-8-8-8z" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <circle cx="15" cy="10" r="1.5" fill="currentColor" />
    </svg>
  );
}

function HatchingDivider({ className = "h-8" }) {
  return (
    <div className={`relative self-stretch overflow-hidden ${className}`}>
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <div className="relative h-full w-full">
          {Array.from({ length: 300 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-4 w-full origin-top-left -rotate-45"
              style={{
                top: `${i * 16 - 120}px`,
                left: "-100%",
                width: "300%",
                outline: "0.5px solid hsl(var(--primary) / 0.12)",
                outlineOffset: "-0.25px",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.register(email, password);
      setToken(data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Outer container with vertical guide lines */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col relative">
        {/* Vertical guide lines */}
        <div className="absolute top-0 left-0 h-full w-px bg-border/50" />
        <div className="absolute top-0 right-0 h-full w-px bg-border/50" />

        {/* Floating header bar */}
        <header className="px-4 pt-4">
          <div className="bg-muted/50 border border-border rounded-2xl px-6 h-14 flex items-center backdrop-blur-sm">
            <Link href="/" className="flex items-center gap-2.5 group">
              <GhostIcon className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-lg tracking-tight group-hover:text-primary transition-colors">GhstMail</span>
            </Link>
          </div>
        </header>

        {/* Hatching divider */}
        <HatchingDivider className="h-6" />

        {/* Form area inside border-x */}
        <div className="border-x border-border/50 flex-1 flex items-center justify-center px-4 pb-16">
          <div className="w-full max-w-sm">
            <div className="opacity-0 animate-fade-up text-center mb-8">
              <h1 className="font-display font-bold text-3xl tracking-tight">Go invisible</h1>
              <p className="text-muted-foreground mt-2 text-sm">Create your account in seconds</p>
            </div>

            <Card className="opacity-0 animate-fade-up-delay-1 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
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
                    ) : "Create account"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <p className="opacity-0 animate-fade-up-delay-2 text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
