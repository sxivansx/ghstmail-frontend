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

export default function LoginPage() {
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
      const data = await api.login(email, password);
      setToken(data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen mesh-gradient flex flex-col">
      <header className="px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-2.5 group">
          <GhostIcon className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-lg tracking-tight group-hover:text-primary transition-colors">GhstMail</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 -mt-16">
        <div className="w-full max-w-sm">
          <div className="opacity-0 animate-fade-up text-center mb-8">
            <h1 className="font-display font-bold text-3xl tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground mt-2 text-sm">Sign in to manage your aliases</p>
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
              </form>
            </CardContent>
          </Card>

          <p className="opacity-0 animate-fade-up-delay-2 text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
