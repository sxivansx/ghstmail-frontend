import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "GhstMail privacy policy. How we handle your data with full transparency.",
};

function GhostIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C7.58 2 4 5.58 4 10v9a1 1 0 001.7.7L7.4 18l1.7 1.7a1 1 0 001.4 0L12 18.2l1.5 1.5a1 1 0 001.4 0L16.6 18l1.7 1.7A1 1 0 0020 19v-9c0-4.42-3.58-8-8-8z" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <circle cx="15" cy="10" r="1.5" fill="currentColor" />
    </svg>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen relative">
      <div className="max-w-7xl mx-auto relative">
        <div className="absolute top-0 left-0 h-full w-px bg-border/50" />
        <div className="absolute top-0 right-0 h-full w-px bg-border/50" />

        <header className="px-4 pt-4">
          <div className="bg-muted/50 border border-border rounded-2xl px-6 h-14 flex items-center backdrop-blur-sm">
            <Link href="/" className="flex items-center gap-2.5 group">
              <GhostIcon className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-lg tracking-tight group-hover:text-primary transition-colors">GhstMail</span>
            </Link>
          </div>
        </header>

      <main className="border-x border-border/50">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display font-bold text-3xl mb-2">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground text-sm mb-10">
          Last updated: July 29, 2026
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
              <li>
                <strong className="text-foreground">Reply tokens</strong> — when
                someone emails one of your aliases, we store their address so
                that replying to the forwarded message can reach them without
                revealing yours. This is the sender&apos;s address, not the
                message. It is deleted when you delete the alias.
              </li>
              <li>
                <strong className="text-foreground">Threading identifiers</strong>{" "}
                — the <code className="text-foreground bg-muted px-1 py-0.5 rounded text-xs">Message-ID</code>{" "}
                of forwarded mail, so replies thread correctly in your mail
                client. An opaque identifier, not content.
              </li>
              <li>
                <strong className="text-foreground">API keys</strong> — if you
                create one, we store its name, the scopes you granted, a
                displayable prefix, and a SHA-256 hash. We never store the key
                itself, which is why it is shown only once.
              </li>
              <li>
                <strong className="text-foreground">Sending records</strong> — if
                you send mail through the API, we record which alias sent it, the
                recipient&apos;s <em>domain</em>, how many recipients there were,
                and when. We deliberately do not store the recipient&apos;s full
                address, the subject, or the body. The domain alone is what lets
                us enforce a sending quota; a full recipient log would be a record
                of who you talk to, which is the thing this service exists to
                avoid.
              </li>
              <li>
                <strong className="text-foreground">Idempotency records</strong> —
                when an API client sends an{" "}
                <code className="text-foreground bg-muted px-1 py-0.5 rounded text-xs">
                  Idempotency-Key
                </code>
                , we keep the response to that request for 24 hours so a retry
                returns the original result instead of creating a duplicate. These
                responses can contain alias details. They are deleted after 24
                hours.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground font-semibold text-lg mb-3">
              Data We Do Not Collect
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>We do not read, store, or log the content of your emails, including subject lines.</li>
              <li>
                We do not keep a list of who you correspond with. Received mail
                records the sender only for as long as the alias exists, and sent
                mail records the recipient&apos;s domain but never their address.
              </li>
              <li>We do not track your browsing history or web activity.</li>
              <li>We do not collect analytics, fingerprints, or telemetry.</li>
              <li>We do not use cookies for tracking or advertising.</li>
              <li>The CLI does not phone home. Its update check queries the npm registry, not us.</li>
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
              Sending From an Alias
            </h2>
            <p>
              If you use the API or CLI to send mail from an alias, the message
              goes out from our server, signed as your alias. The recipient sees
              the alias and never your real address, and their reply arrives back
              at the alias and forwards to you.
            </p>
            <p className="mt-2">
              The message itself is not stored, before or after sending. We record
              only which alias sent it, the recipient&apos;s domain, the number of
              recipients, and the time, which is what enforces a per-account
              quota. Sending requires an API key you created with the{" "}
              <code className="text-foreground bg-muted px-1.5 py-0.5 rounded text-xs">
                messages:send
              </code>{" "}
              permission, and no key has that permission unless you granted it
              explicitly.
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
              tokens, which means older forwarded messages can no longer be
              replied to through it. You can delete your account at any time,
              which removes all your data from our systems.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>
                <strong className="text-foreground">Idempotency records</strong> —
                24 hours, then deleted.
              </li>
              <li>
                <strong className="text-foreground">Sending records</strong> —
                retained while the alias exists, and deleted with it. They hold a
                recipient domain and a timestamp, never an address or content.
              </li>
              <li>
                <strong className="text-foreground">Revoked API keys</strong> — the
                row is kept, marked revoked, so you can see that a key existed and
                when it was last used. Only the hash is stored, never the key.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground font-semibold text-lg mb-3">
              Security
            </h2>
            <p>
              Passwords are hashed with bcrypt. API keys are stored only as a
              SHA-256 hash, so a key cannot be recovered from our database, which
              is why we show it to you exactly once. All connections use TLS. DKIM
              signing is applied to forwarded and sent email. Dashboard
              authentication uses short-lived JWT tokens, and API keys carry
              scopes so a key can be limited to only what it needs.
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
      </main>
      </div>
    </div>
  );
}
