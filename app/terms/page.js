import Link from "next/link";
import { LegalPage, Section } from "@/components/legal-page";

export const metadata = {
  title: "Terms of Service",
  description: "The terms for using GhstMail, the email alias service.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="November 13, 2026">
      <Section title="Who we are">
        <p>
          GhstMail is run by Govind Pandey, an individual based in India. In these terms, &quot;we&quot;
          and &quot;us&quot; mean GhstMail, and &quot;you&quot; means the person using it. By creating an
          account or using GhstMail, you agree to these terms and to our{" "}
          <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>
      </Section>

      <Section title="Who can use GhstMail">
        <ul className="list-disc pl-5 space-y-2">
          <li>You must be at least 18 years old.</li>
          <li>
            An account is for one person. Keep your password and API keys private; you are
            responsible for what happens under your account.
          </li>
          <li>
            The email address on your account must be one you control, because that is where your
            mail is forwarded.
          </li>
        </ul>
      </Section>

      <Section title="What the service does">
        <p>
          GhstMail gives you email aliases that forward to your real inbox, lets you reply from
          them, and lets you send from them through our API. We work to deliver every message, but
          email passes through systems we don&apos;t control, so we can&apos;t guarantee that every
          message arrives or arrives on time. Keep important accounts on an address you can always
          reach.
        </p>
      </Section>

      <Section title="Acceptable use">
        <p>You may not use GhstMail to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>send spam, or mail that the recipient did not ask for;</li>
          <li>phish, scam, or impersonate a person or organization;</li>
          <li>send malware, or harass, threaten or stalk anyone;</li>
          <li>break the law, or help someone else break it;</li>
          <li>
            commit fraud, including using many aliases to get around another service&apos;s limits
            or bans in breach of that service&apos;s terms;
          </li>
          <li>overload, probe or attack GhstMail or try to get around its limits.</li>
        </ul>
        <p>
          If we find or are told about abuse, we may turn off the aliases involved, suspend the
          account, or delete it. Where we can, we&apos;ll tell you first and give you a chance to
          explain.
        </p>
      </Section>

      <Section title="Your mail">
        <p>
          We don&apos;t read your email, and we don&apos;t store its content. Mail passes through our
          server only to be forwarded. What we do store, and for how long, is set out in the{" "}
          <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>. If
          Indian authorities send us a valid legal request, we can only hand over what we actually
          store.
        </p>
      </Section>

      <Section title="Paid plans">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Paid plans and their prices are listed on the{" "}
            <Link href="/pricing" className="text-primary hover:underline">pricing page</Link>.
          </li>
          <li>
            Payments are handled by Dodo Payments, which sells the subscription to you as merchant
            of record. Dodo&apos;s own terms of sale apply to the payment, and Dodo collects any tax
            that applies, such as GST or VAT. We never see your card details.
          </li>
          <li>
            Subscriptions renew automatically at the end of each month or year until you cancel. You
            can cancel at any time and keep the paid features until the end of the period you paid
            for.
          </li>
          <li>
            If we change the price of your plan, we&apos;ll email you at least 30 days before your
            next renewal at the new price.
          </li>
          <li>
            Refunds work as described in the{" "}
            <Link href="/refunds" className="text-primary hover:underline">Refund Policy</Link>.
          </li>
        </ul>
      </Section>

      <Section title="Ending your account">
        <p>
          You can stop using GhstMail at any time. To delete your account and everything in it, email{" "}
          <a href="mailto:support@ghstmail.space" className="text-primary hover:underline">
            support@ghstmail.space
          </a>{" "}
          from the address on your account, and we&apos;ll delete it within 7 days. Once an account
          is deleted, its aliases stop working and cannot be recovered.
        </p>
        <p>
          If we ever shut GhstMail down, we&apos;ll give you at least 30 days&apos; notice by email so
          you can move your accounts to other addresses, and refund the unused part of any paid
          period.
        </p>
      </Section>

      <Section title="No guarantees">
        <p>
          GhstMail is provided as it is. As far as the law allows, we don&apos;t promise that it will
          be uninterrupted or free of errors, and we are not liable for indirect losses, such as a
          missed email, a lost account elsewhere or lost profit. Our total liability to you is
          limited to what you paid us in the 12 months before the problem. Nothing here limits rights
          that the law does not allow us to limit.
        </p>
      </Section>

      <Section title="Changes to these terms">
        <p>
          When these terms change, we update the date at the top. If a change affects you in a
          meaningful way, we&apos;ll email you before it takes effect.
        </p>
      </Section>

      <Section title="Governing law">
        <p>These terms are governed by the laws of India.</p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about these terms:{" "}
          <a href="mailto:support@ghstmail.space" className="text-primary hover:underline">
            support@ghstmail.space
          </a>
        </p>
      </Section>
    </LegalPage>
  );
}
