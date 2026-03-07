"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, setToken } from "../../lib/api";
import Link from "next/link";

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
      {/* Minimal header */}
      <header className="px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-2.5 group">
          <svg className="w-6 h-6 text-phantom-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C7.58 2 4 5.58 4 10v9a1 1 0 001.7.7L7.4 18l1.7 1.7a1 1 0 001.4 0L12 18.2l1.5 1.5a1 1 0 001.4 0L16.6 18l1.7 1.7A1 1 0 0020 19v-9c0-4.42-3.58-8-8-8z" />
            <circle cx="9" cy="10" r="1.5" fill="currentColor" />
            <circle cx="15" cy="10" r="1.5" fill="currentColor" />
          </svg>
          <span className="font-display font-bold text-lg tracking-tight group-hover:text-phantom-400 transition-colors">GhstMail</span>
        </Link>
      </header>

      {/* Centered form */}
      <div className="flex-1 flex items-center justify-center px-4 -mt-16">
        <div className="w-full max-w-sm">
          <div className="opacity-0 animate-fade-up text-center mb-8">
            <h1 className="font-display font-bold text-3xl tracking-tight">Welcome back</h1>
            <p className="text-void-300 mt-2 text-sm">Sign in to manage your aliases</p>
          </div>

          <form onSubmit={handleSubmit} className="opacity-0 animate-fade-up-delay-1 space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-void-300 mb-1.5 ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-void-800/50 border border-void-600/40 rounded-xl text-void-50 placeholder:text-void-400 focus:outline-none focus:border-phantom-400/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-void-300 mb-1.5 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-void-800/50 border border-void-600/40 rounded-xl text-void-50 placeholder:text-void-400 focus:outline-none focus:border-phantom-400/50 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-phantom-400 text-void-950 rounded-xl font-semibold hover:bg-phantom-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-green mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-void-950/30 border-t-void-950 rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : "Sign in"}
            </button>
          </form>

          <p className="opacity-0 animate-fade-up-delay-2 text-center text-sm text-void-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-phantom-400 hover:text-phantom-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
