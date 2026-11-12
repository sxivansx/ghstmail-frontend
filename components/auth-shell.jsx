import { SiteHeader } from "@/components/site-header";
import { PeekingGhost } from "@/components/peeking-ghost";

// The frame the login and register pages use (header bar, bordered column),
// for the smaller account pages: password reset and finishing a sign-in.
export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <SiteHeader />
      <div className="max-w-[1180px] mx-auto w-full flex-1 flex flex-col relative">
        <main className="flex-1 flex items-center justify-center px-4 py-16 mt-6">
          <div className="w-full max-w-sm">
            <div className="text-center mb-14">
              <h1 className="font-display font-bold text-3xl tracking-tight">{title}</h1>
              {subtitle && <p className="text-muted-foreground mt-2 text-sm">{subtitle}</p>}
            </div>
            <div className="relative">
              <PeekingGhost />
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
