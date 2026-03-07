import "./globals.css";

export const metadata = {
  title: "GhstMail — Email Alias Dashboard",
  description: "Manage your email aliases and privacy settings",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
