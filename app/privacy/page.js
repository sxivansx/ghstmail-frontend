import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — GhstMail",
  description: "GhstMail privacy policy. How we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          &larr; Back to home
        </Link>

        <h1 className="font-display font-bold text-3xl mt-8 mb-2">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground text-sm mb-10">
          Last updated: March 8, 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-foreground font-semibold text-lg mb-3">
              What GhstMail Does
            </h2>
            <p>
              GhstMail is an email alias service. You create disposable email
              addresses that forward incoming mail to your real inbox. Your real
              email address is never exposed to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-foreground font-semibold text-lg mb-3">
              Data We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-foreground">Email address</strong> —
                used to create your account and as the forwarding destination for
                your aliases.
              </li>
              <li>
                <strong className="text-foreground">Password</strong> — hashed
                with bcrypt before storage. We never store or see your plaintext
                password.
              </li>
              <li>
                <strong className="text-foreground">Alias metadata</strong> —
                alias addresses, labels, active/inactive status, creation dates,
                and aggregate counts (emails received/forwarded). We do not store
                the content of forwarded emails.
              </li>
              <li>
                <strong className="text-foreground">Filter rules</strong> —
                domains you choose to block or allow.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground font-semibold text-lg mb-3">
              Data We Do Not Collect
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>We do not read, store, or log the content of your emails.</li>
              <li>We do not track your browsing history or web activity.</li>
              <li>We do not collect analytics, fingerprints, or telemetry.</li>
              <li>We do not use cookies for tracking or advertising.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground font-semibold text-lg mb-3">
              Chrome Extension
            </h2>
            <p>The GhstMail Chrome extension:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                Stores your authentication token locally using{" "}
                <code className="text-foreground bg-muted px-1.5 py-0.5 rounded text-xs">
                  chrome.storage.local
                </code>{" "}
                so you stay logged in.
              </li>
              <li>
                Detects email input fields on web pages to show the alias
                generation button. No page content is collected or transmitted.
              </li>
              <li>
                Communicates only with{" "}
                <code className="text-foreground bg-muted px-1.5 py-0.5 rounded text-xs">
                  api.ghstmail.space
                </code>{" "}
                to generate aliases and authenticate. No other external requests
                are made.
              </li>
              <li>Does not inject remote code or execute external scripts.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground font-semibold text-lg mb-3">
              How Email Forwarding Works
            </h2>
            <p>
              When an email arrives at one of your aliases, our server parses it,
              rewrites the headers, and forwards it to your real email address.
              The email content passes through our server in transit but is never
              stored on disk or in our database. Reply tokens are generated to
              enable two-way communication without revealing your real address.
            </p>
          </section>

          <section>
            <h2 className="text-foreground font-semibold text-lg mb-3">
              Third-Party Sharing
            </h2>
            <p>
              We do not sell, rent, or share your personal data with any third
              party. We do not use your data for advertising, analytics, or
              creditworthiness purposes.
            </p>
          </section>

          <section>
            <h2 className="text-foreground font-semibold text-lg mb-3">
              Data Retention
            </h2>
            <p>
              Your account data is retained as long as your account is active.
              Deleting an alias permanently removes it and all associated reply
              tokens. You can delete your account at any time, which removes all
              your data from our systems.
            </p>
          </section>

          <section>
            <h2 className="text-foreground font-semibold text-lg mb-3">
              Security
            </h2>
            <p>
              Passwords are hashed with bcrypt. All connections use TLS. DKIM
              signing is applied to forwarded emails. Authentication uses
              short-lived JWT tokens.
            </p>
          </section>

          <section>
            <h2 className="text-foreground font-semibold text-lg mb-3">
              Contact
            </h2>
            <p>
              For questions about this privacy policy, contact us at{" "}
              <a
                href="mailto:privacy@ghstmail.space"
                className="text-primary hover:underline"
              >
                privacy@ghstmail.space
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
