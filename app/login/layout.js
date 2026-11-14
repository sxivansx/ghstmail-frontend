import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/login",
  title: "Sign In",
  description: "Sign in to GhstMail to manage your disposable email aliases.",
});

export default function LoginLayout({ children }) {
  return children;
}
