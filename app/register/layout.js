import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/register",
  title: "Create Account",
  description: "Create your free GhstMail account. Generate disposable email aliases, reply anonymously, and block spam.",
});

export default function RegisterLayout({ children }) {
  return children;
}
