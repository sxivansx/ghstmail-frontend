"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

// The emailed link goes to the backend, which checks the token and sends the
// browser here with ?token=... (or ?error=INVALID_TOKEN when it has expired).
export default function ResetPasswordPage() {
  const [token, setToken] = useState(null);
  const [linkError, setLinkError] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token"));
    setLinkError(Boolean(params.get("error")) || !params.get("token"));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await api.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (token === null && !linkError) return null;

  if (linkError) {
    return (
      <AuthShell title="This link has expired" subtitle="Reset links work once, for one hour.">
        <p className="text-center text-sm">
          <Link href="/forgot-password" className="text-primary hover:underline font-medium">
            Send a new link
          </Link>
        </p>
      </AuthShell>
    );
  }

  if (done) {
    return (
      <AuthShell
        title="Password changed"
        subtitle="You have been signed out everywhere else. Sign in with your new password."
      >
        <Button asChild className="w-full glow-primary">
          <Link href="/login">Sign in</Link>
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Choose a new password">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div role="alert" className="px-4 py-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoFocus
                autoComplete="new-password"
                placeholder="Min. 8 characters"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Repeat it</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full glow-primary">
              {loading ? "Saving..." : "Save new password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
