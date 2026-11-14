import { LegalPage, Section } from "@/components/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/privacy",
  title: "Privacy Policy",
  description: "What GhstMail stores, what it never stores, and how long it keeps things.",
});

const strong = "text-foreground";
const sub = "font-display font-semibold text-[1.05rem] text-foreground pt-3";
const code = "text-foreground bg-muted px-1 py-0.5 rounded text-xs";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="November 13, 2026"
      lede={
        <>
          GhstMail forwards mail to you without reading it or storing it. To make that work we keep
          your email address, your aliases, and the address of whoever wrote to each alias, so your
          replies can find them. Our servers keep short-lived logs for running the service. We
          don&apos;t run analytics, ads or trackers, and we never sell or share your data.
        </>
      }
    >
      <Section title="What GhstMail does">
        <p>
          GhstMail gives you email aliases: addresses you can hand out instead of your real one. Mail
          sent to an alias is forwarded to your real inbox, and when you reply, the reply goes out
          from the alias. The people you write to only ever see the alias.
        </p>
      </Section>

      <Section title="What we store">
        <h3 className={sub}>Your account</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className={strong}>Email address</strong>: your login, and where your aliases
            forward to.
          </li>
          <li>
            <strong className={strong}>Password</strong>, if you set one. It is stored only as a hash:
            scrypt, or bcrypt for passwords set before November 2026. We can&apos;t see your password.
          </li>
          <li>
            <strong className={strong}>Google or GitHub sign-in</strong>, if you use it. The provider
            tells us your email address and confirms it&apos;s yours. We ask for nothing else, and we
            discard the name and photo the provider sends anyway. We keep the provider&apos;s ID for
            your account so it signs you in next time.
          </li>
          <li>
            <strong className={strong}>Sign-in sessions</strong>: a session record with an expiry date
            (7 days), so it can be ended when you sign out or reset your password. We don&apos;t record
            your IP address or browser with it. It&apos;s held in a cookie on{" "}
            <code className={code}>api.ghstmail.space</code>, used only to keep you signed in.
          </li>
          <li>
            <strong className={strong}>Email confirmation</strong>: whether you&apos;ve confirmed your
            address, plus single-use codes for confirming it or resetting your password. Those codes
            expire within an hour.
          </li>
        </ul>

        <h3 className={sub}>Your aliases</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Each alias&apos;s address, label, on/off status, creation date, expiry, and running counts
            of messages received and forwarded.
          </li>
          <li>Filter rules: the domains you block or allow.</li>
        </ul>

        <h3 className={sub}>What makes replies work</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className={strong}>The sender&apos;s address</strong> for each message forwarded
            to you, so your reply can reach them without revealing your address. Not the message, not
            the subject.
          </li>
          <li>
            <strong className={strong}>The <code className={code}>Message-ID</code></strong> of
            forwarded mail, an opaque identifier, so replies thread correctly in your mail client.
          </li>
          <li>Both are kept while the alias exists and deleted when you delete it.</li>
        </ul>

        <h3 className={sub}>If you use the API</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className={strong}>API keys</strong>: the name, the permissions you granted, a short
            prefix so you can tell keys apart, and a SHA-256 hash. Never the key itself, which is why
            it&apos;s shown only once.
          </li>
          <li>
            <strong className={strong}>Sending records</strong>: for mail sent through the API, which
            alias sent it, the recipient&apos;s domain (never their full address), the number of
            recipients and the time. This enforces the sending quota.
          </li>
          <li>
            <strong className={strong}>Idempotency records</strong>: the response to a request sent
            with an <code className={code}>Idempotency-Key</code>, kept 24 hours so a retry doesn&apos;t
            create a duplicate.
          </li>
        </ul>
      </Section>

      <Section title="What passes through but is never stored">
        <p>
          The content of your email: the body, attachments and subject line. A message is processed in
          memory on our server, forwarded, and discarded. It never touches our database or disk.
        </p>
      </Section>

      <Section title="Server logs">
        <p>Like any mail server, ours keeps operational logs so we can fix delivery problems and stop abuse:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className={strong}>The mail server</strong> logs the sender and recipient
            addresses of each delivery, the IP address of the server that connected, and the results
            of standard anti-spam checks (SPF, DKIM and reverse DNS).
          </li>
          <li>
            <strong className={strong}>The API</strong> logs the IP address and path of each request,
            not what was sent in it.
          </li>
        </ul>
        <p>
          Logs never contain message content or subject lines. We&apos;re adding size limits to our
          logs, so that old entries are overwritten as new ones arrive.
        </p>
      </Section>

      <Section title="Backups">
        <p>
          We&apos;re setting up nightly backups of our database so a failure doesn&apos;t lose your
          aliases. They will stay on our own server and delete themselves after 30 days, so anything
          you delete from GhstMail will be gone from backups within that time.
        </p>
      </Section>

      <Section title="What we never collect">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            No analytics, tracking pixels, fingerprinting or telemetry, on the website, in the Chrome
            extension or in the CLI.
          </li>
          <li>No cookies for tracking or advertising. The only cookie is the sign-in one above.</li>
          <li>No browsing history or web activity.</li>
          <li>The CLI&apos;s update check asks the npm registry, not us.</li>
        </ul>
      </Section>

      <Section title="Services we rely on">
        <p>We don&apos;t sell, rent or share your data. Running GhstMail does mean these companies handle traffic on our behalf:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong className={strong}>DigitalOcean</strong> hosts our server and database.</li>
          <li>
            <strong className={strong}>Cloudflare</strong> sits in front of{" "}
            <code className={code}>api.ghstmail.space</code>, so it sees API requests in transit.
          </li>
          <li>
            <strong className={strong}>Vercel</strong> hosts this website, so it sees normal web
            requests to <code className={code}>ghstmail.space</code>.
          </li>
          <li><strong className={strong}>Google or GitHub</strong>, only if you choose to sign in with them.</li>
        </ul>
        <p>Forwarded mail is delivered to your own email provider, and your replies to the sender&apos;s.</p>
      </Section>

      <Section title="Chrome extension">
        <ul className="list-disc pl-5 space-y-2">
          <li>Stores your sign-in token in your browser (<code className={code}>chrome.storage.local</code>).</li>
          <li>Looks for email fields on pages to show the alias button, without collecting or sending any page content.</li>
          <li>Talks only to <code className={code}>api.ghstmail.space</code>.</li>
          <li>Runs no remote code.</li>
        </ul>
      </Section>

      <Section title="Sending from an alias">
        <p>
          If you send mail through the API or CLI, it goes out from our server, signed as your alias.
          The message isn&apos;t stored before or after sending; we keep only the sending record
          described above. Sending needs an API key that you explicitly gave the{" "}
          <code className={code}>messages:send</code> permission.
        </p>
      </Section>

      <Section title="How long we keep things">
        <dl className="rounded-2xl border border-border bg-card overflow-hidden">
          {[
                ["Account and aliases", "Until you delete them"],
                ["Sender addresses and Message-IDs", "Until the alias is deleted"],
                ["Sign-in sessions", "7 days, sign-out, or a password reset"],
                ["Confirmation and reset codes", "1 hour, or first use"],
                ["Idempotency records", "24 hours"],
                ["Server logs", "Size limit being added"],
                ["Backups", "30 days, once nightly backups are running"],
                ["Revoked API keys", "Kept and marked revoked, hash only"],
          ].map(([what, until]) => (
            <div key={what} className="grid gap-1 px-5 py-3.5 border-t border-border/60 first:border-t-0 sm:grid-cols-[1fr_1.1fr] sm:gap-6">
              <dt className="text-foreground">{what}</dt>
              <dd>{until}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Your choices">
        <ul className="list-disc pl-5 space-y-2">
          <li>Delete an alias at any time from the dashboard. Its reply records go with it immediately.</li>
          <li>
            Delete your account by emailing{" "}
            <a href="mailto:support@ghstmail.space" className="text-primary hover:underline">support@ghstmail.space</a>{" "}
            from your account&apos;s address. We delete it, with everything in it, within 7 days. Once
            backups are running, they age out within 30 days after that.
          </li>
          <li>Ask what we hold about you by emailing us, and we&apos;ll send it to you.</li>
        </ul>
      </Section>

      <Section title="Security">
        <ul className="list-disc pl-5 space-y-2">
          <li>Passwords are hashed with scrypt, or bcrypt for older ones.</li>
          <li>API keys are stored only as hashes, and carry permissions so a key can do only what you allowed.</li>
          <li>Every connection to the website and API uses TLS, and our mail server accepts encrypted (STARTTLS) connections.</li>
          <li>Forwarded and sent mail is DKIM-signed.</li>
        </ul>
      </Section>

      <Section title="Changes to this policy">
        <p>
          When this policy changes, we update the date at the top. If a change lets us keep more about
          you, we&apos;ll email account holders before it takes effect.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions or requests:{" "}
          <a href="mailto:privacy@ghstmail.space" className="text-primary hover:underline">privacy@ghstmail.space</a>
        </p>
      </Section>
    </LegalPage>
  );
}
