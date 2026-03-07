import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata = {
  title: "GhstMail — Your email, invisible.",
  description:
    "Generate disposable email aliases that forward to your inbox. Reply anonymously. Block spam. Stay invisible.",
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
