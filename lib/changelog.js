// What has shipped, newest first. This is the source for /changelog.
// Write for someone who uses GhstMail, not for someone who reads the code:
// say what they can now do or what looks different, and leave out the plumbing.

export const AREAS = ["Website", "Dashboard", "Extension", "API and CLI", "Account"];

export const releases = [
  {
    date: "2026-11-13",
    title: "A new look, and a quicker dashboard",
    summary:
      "The whole site was redesigned, the dashboard was rebuilt, and the Chrome extension got its first update since launch.",
    changes: [
      {
        area: "Dashboard",
        items: [
          "A new layout with a sidebar, and tables in place of cards.",
          "An overview of your account at the top: how much of your mail was forwarded, and how many aliases are active or paused.",
          "Instant alias: one click, or the G key, makes an alias and copies it. No label, no form.",
          "Search your aliases by address or label, and filter by active or paused.",
          "Aliases load 25 at a time, so a long list stays quick.",
          "API keys describe their access in plain words, and a new key is shown once in its own dialog.",
          "Deleting an alias and revoking a key now ask in a proper dialog that says what will happen.",
          "Keyboard shortcuts: / to search, N for a new alias or key.",
        ],
      },
      {
        area: "Extension",
        items: [
          "Version 1.1.2 is with the Chrome Web Store for review and will update by itself once approved.",
          "The alias button now sits inside the email field as a small ghost, instead of being pushed underneath it.",
          "A redesigned popup that shows which site the alias is for, and your recent aliases.",
          "Sign in through the website, which also works if you signed up with Google.",
          "It no longer loads fonts from Google. The extension talks only to GhstMail.",
        ],
      },
      {
        area: "Website",
        items: [
          "A new home page, with a box where you can try making an alias before signing up.",
          "A plain list of what we keep and what we never keep, taken from the privacy policy.",
          "The API reference has a sidebar that follows your place, and a sample request you can watch run.",
          "The privacy policy was rewritten to be easier to read, and there are now terms and a refund policy.",
        ],
      },
    ],
  },
  {
    date: "2026-11-12",
    title: "Sign in with Google, and reset your password",
    summary: "Two things people asked for: a way in without another password, and a way back in when you forget one.",
    changes: [
      {
        area: "Account",
        items: [
          "Sign up or sign in with your Google account. We receive your email address and nothing else.",
          "Forgot your password? Ask for a reset link from the sign-in page.",
        ],
      },
    ],
  },
  {
    date: "2026-11-11",
    title: "Clearer errors in the dashboard",
    summary: "When something goes wrong the dashboard now says so, instead of looking empty.",
    changes: [
      {
        area: "Dashboard",
        items: [
          "If your aliases cannot be loaded, you see why and can try again.",
          "When your session expires you are taken to sign in, then returned to the page you were on.",
        ],
      },
    ],
  },
  {
    date: "2026-07-29",
    title: "A public API and a command line tool",
    summary: "Everything the dashboard does with aliases and filters can now be scripted.",
    changes: [
      {
        area: "API and CLI",
        items: [
          "A REST API for aliases and filters, with an OpenAPI spec and a reference at /docs.",
          "API keys you create in the dashboard, each limited to the access you give it.",
          "A CLI: run ghstmail new github to make an alias and copy it.",
          "Send mail from an alias through the API, with a key you have given that permission.",
        ],
      },
    ],
  },
  {
    date: "2026-03-28",
    title: "Pricing page",
    summary: "A page that says plainly what GhstMail costs.",
    changes: [
      {
        area: "Website",
        items: ["A pricing page, and clearer wording across the site about what GhstMail does and does not do."],
      },
    ],
  },
  {
    date: "2026-03-08",
    title: "First release",
    summary: "The first version: email aliases that forward to your real inbox.",
    changes: [
      {
        area: "Dashboard",
        items: [
          "Create aliases, switch them on and off, and delete them.",
          "Reply from an alias without showing your real address.",
          "Block or allow mail by domain.",
          "Aliases that expire by themselves after a time you choose.",
        ],
      },
      {
        area: "Extension",
        items: ["A Chrome extension that makes an alias from any sign-up form."],
      },
      {
        area: "Website",
        items: ["A privacy policy that says what is stored and what is not."],
      },
    ],
  },
];

export function formatReleaseDate(date) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
