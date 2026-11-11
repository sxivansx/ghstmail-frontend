"use client";
import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    // Worded the same whether or not the account exists, so this page cannot
    // be used to find out who has one.
    return (
      <AuthShell
        title="Check your email"
        subtitle={`If there is a GhstMail account for ${email}, a link to reset its password is on its way. It works for one hour.`}
      >
        <p className="text-center text-sm text-muted-foreground">
          Nothing after a few minutes? Check your spam folder, or{" "}
          <button type="button" onClick={() => setSent(false)} className="text-primary hover:underline font-medium">
            try again
          </button>
          .
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Reset your password" subtitle="We will email you a link to choose a new one.">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div role="alert" className="px-4 py-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm">
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
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full glow-primary">
              {loading ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="text-center text-sm text-muted-foreground mt-6">
        Remembered it?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
