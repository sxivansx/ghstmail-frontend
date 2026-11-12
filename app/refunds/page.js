import { LegalPage, Section } from "@/components/legal-page";

export const metadata = {
  title: "Refund Policy",
  description: "How cancelling and refunds work for GhstMail paid plans.",
};

export default function RefundsPage() {
  return (
    <LegalPage title="Refund Policy" updated="November 13, 2026">
      <Section title="The short version">
        <p>
          Cancel any time. If GhstMail isn&apos;t right for you, ask within 14 days of paying and
          we&apos;ll refund you in full.
        </p>
      </Section>

      <Section title="Cancelling">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            You can cancel a paid plan at any time from the billing section of your account, or by
            emailing us.
          </li>
          <li>
            After cancelling, you keep the paid features until the end of the month or year you paid
            for, and you won&apos;t be charged again.
          </li>
        </ul>
      </Section>

      <Section title="Full refunds within 14 days">
        <p>We refund the full amount if you ask within 14 days of:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>your first payment for a paid plan, monthly or yearly, or</li>
          <li>a yearly renewal.</li>
        </ul>
        <p>You don&apos;t need to give a reason.</p>
      </Section>

      <Section title="Monthly renewals">
        <p>
          Monthly renewals are not refunded, because you can cancel before the next one. The
          exception is a billing mistake, covered below.
        </p>
      </Section>

      <Section title="Billing mistakes">
        <p>
          If you were charged twice, charged after cancelling, or charged the wrong amount, tell us
          within 60 days and we&apos;ll refund the mistaken charge in full.
        </p>
      </Section>

      <Section title="How to ask">
        <p>
          Email{" "}
          <a href="mailto:support@ghstmail.space" className="text-primary hover:underline">
            support@ghstmail.space
          </a>{" "}
          from the address on your account. Payments are handled by Dodo Payments as merchant of
          record, so the refund goes back to the card or account you paid with. Banks usually show it
          within 5 to 10 business days.
        </p>
        <p>
          If something looks wrong on a charge, please email us before disputing it with your bank;
          we can usually fix it faster.
        </p>
      </Section>

      <Section title="After a refund">
        <p>
          Your account moves back to the free plan. Your existing aliases keep forwarding mail, but
          if you have more active aliases than the free plan allows, you can&apos;t create new ones
          until you&apos;re back under the limit. Features that only exist on paid plans stop.
        </p>
      </Section>
    </LegalPage>
  );
}
