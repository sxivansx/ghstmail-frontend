import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata = {
  title: {
    default: "GhstMail — Disposable Email Aliases | Privacy-First Email Forwarding",
    template: "%s — GhstMail",
  },
  description:
    "Generate disposable email aliases that forward to your real inbox. Reply anonymously without exposing your identity. Block spam by domain. Free, private, no tracking.",
  openGraph: {
    title: "GhstMail — Your email, invisible.",
    description:
      "Generate disposable email aliases that forward to your inbox. Reply anonymously. Block spam. Stay invisible.",
    url: "https://ghstmail.space",
    siteName: "GhstMail",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GhstMail — Your email, invisible.",
    description:
      "Disposable email aliases that forward to your inbox. Reply anonymously. Block spam. Free forever.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
