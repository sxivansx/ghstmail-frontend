import "./globals.css";

export const metadata = {
  title: "GhstMail — Your email, invisible.",
  description: "Generate disposable email aliases that forward to your inbox. Reply anonymously. Block spam. Stay invisible.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
