import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SectionNav } from "@/components/section-nav";
import { highlight } from "./highlight";
import { CopyButton } from "./code-block";
import { TryIt } from "./try-it";
import { splitEndpoint } from "@/lib/docs-format";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/docs",
  title: "API Reference",
  description:
    "The GhstMail API. Create disposable email aliases, block senders by domain, and check delivery, from your own code or the command line.",
  ogTitle: "GhstMail API Reference",
  ogDescription:
    "Create disposable email aliases from your own code. REST, API keys, idempotent writes, and a zero-dependency CLI.",
});

/* Code blocks are pre-formatted strings so nothing has to be escaped inline. */

const QUICKSTART = `curl https://api.ghstmail.space/v1/aliases \\
  -H "Authorization: Bearer $GHSTMAIL_KEY" \\
  -d '{"label": "newsletter"}'`;

const QUICKSTART_RESPONSE = `{
  "object": "alias",
  "id": "9c1f5e02-4a7b-4c3d-8e21-5b6a7c8d9e0f",
  "address": "newsletter.k7f2q@ghstmail.space",
  "label": "newsletter",
  "active": true,
  "expires_at": null,
  "emails_received": 0,
  "emails_forwarded": 0,
  "created_at": "2026-07-29T10:24:11.028Z",
  "updated_at": "2026-07-29T10:24:11.028Z"
}`;

const AUTH_EXAMPLE = `Authorization: Bearer gm_live_kQ8xR2mN...`;

const ERROR_EXAMPLE = `{
  "error": {
    "type": "validation_error",
    "code": "parameter_invalid",
    "message": "'domain': must match pattern",
    "param": "domain"
  },
  "request_id": "req_0850ce41f4fe1f98cf0990b9"
}`;

const PAGINATION_EXAMPLE = `curl "https://api.ghstmail.space/v1/aliases?limit=20&starting_after=$LAST_ID" \\
  -H "Authorization: Bearer $GHSTMAIL_KEY"`;

const PAGINATION_RESPONSE = `{
  "object": "list",
  "data": [ { "object": "alias", "...": "..." } ],
  "has_more": true
}`;

const RATE_HEADERS = `X-RateLimit-Limit: 120
X-RateLimit-Remaining: 117
X-RateLimit-Reset: 1785320760`;

const IDEMPOTENCY_EXAMPLE = `curl https://api.ghstmail.space/v1/aliases \\
  -H "Authorization: Bearer $GHSTMAIL_KEY" \\
  -H "Idempotency-Key: 7f3c1a90-signup-form" \\
  -d '{"label": "signup"}'`;

const CREATE_EXPIRING = `# Self-destructs in 24 hours
curl https://api.ghstmail.space/v1/aliases \\
  -H "Authorization: Bearer $GHSTMAIL_KEY" \\
  -d '{"label": "free trial", "expires_in": 86400}'

# Or choose the address yourself
curl https://api.ghstmail.space/v1/aliases \\
  -H "Authorization: Bearer $GHSTMAIL_KEY" \\
  -d '{"local_part": "shopping"}'`;

const DISABLE_ALIAS = `curl -X PATCH https://api.ghstmail.space/v1/aliases/$ALIAS_ID \\
  -H "Authorization: Bearer $GHSTMAIL_KEY" \\
  -d '{"active": false}'`;

const FILTER_EXAMPLE = `# Stop everything from one domain, across every alias
curl https://api.ghstmail.space/v1/filters \\
  -H "Authorization: Bearer $GHSTMAIL_KEY" \\
  -d '{"domain": "spam.example.com"}'

# Or scope it to a single alias
curl https://api.ghstmail.space/v1/filters \\
  -H "Authorization: Bearer $GHSTMAIL_KEY" \\
  -d '{"domain": "marketing.example.com", "alias_id": "'$ALIAS_ID'"}'`;

const SEND_EXAMPLE = `curl https://api.ghstmail.space/v1/messages \\
  -H "Authorization: Bearer $GHSTMAIL_KEY" \\
  -H "Idempotency-Key: $(uuidgen)" \\
  -d '{
    "from": "newsletter.k7f2q@ghstmail.space",
    "to": "someone@example.com",
    "subject": "Following up",
    "text": "Sent from an alias. Reply and it reaches me."
  }'`;

const SEND_RESPONSE = `{
  "object": "message",
  "id": "<8b8c988c-2347-0a4a-a0c0-72fa77cb76f4@ghstmail.space>",
  "from": "newsletter.k7f2q@ghstmail.space",
  "to": ["someone@example.com"],
  "subject": "Following up",
  "status": "sent",
  "accepted": ["someone@example.com"],
  "rejected": [],
  "quota": {
    "per_hour": { "used": 1, "limit": 60 },
    "per_day": { "used": 1, "limit": 300 }
  },
  "sent_at": "2026-07-29T11:34:02.117Z"
}`;

const SEND_CLI = `# Body inline, from a file, from stdin, or in your editor
ghstmail send --from newsletter --to someone@example.com \\
  --subject "Following up" --text "Sent from an alias."

ghstmail send --from newsletter --to someone@example.com \\
  --subject "Report" --body ./report.txt

cat notes.md | ghstmail send --from newsletter --to a@example.com \\
  --subject "Notes" --body -

# See exactly what would go on the wire, send nothing
ghstmail send --from newsletter --to a@example.com \\
  --subject "hi" --text "hello" --dry-run`;

const JS_EXAMPLE = `const API = "https://api.ghstmail.space/v1";

async function createAlias(label) {
  const res = await fetch(\`\${API}/aliases\`, {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.GHSTMAIL_KEY}\`,
      "Content-Type": "application/json",
      // Safe to retry on a dropped connection: you get the
      // original alias back instead of a second one.
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify({ label }),
  });

  if (!res.ok) {
    const { error, request_id } = await res.json();
    throw new Error(\`\${error.code}: \${error.message} (\${request_id})\`);
  }
  return res.json();
}

const alias = await createAlias("hacker news");
console.log(alias.address);`;

const PY_EXAMPLE = `import os, uuid, requests

API = "https://api.ghstmail.space/v1"
session = requests.Session()
session.headers["Authorization"] = f"Bearer {os.environ['GHSTMAIL_KEY']}"

def create_alias(label: str) -> dict:
    res = session.post(
        f"{API}/aliases",
        json={"label": label},
        headers={"Idempotency-Key": str(uuid.uuid4())},
        timeout=30,
    )
    if not res.ok:
        body = res.json()
        raise RuntimeError(f"{body['error']['code']}: {body['error']['message']}")
    return res.json()

def iter_aliases():
    """Walk every page without tripping the rate limit."""
    cursor = None
    while True:
        params = {"limit": 100}
        if cursor:
            params["starting_after"] = cursor
        page = session.get(f"{API}/aliases", params=params, timeout=30).json()
        yield from page["data"]
        if not page["has_more"]:
            return
        cursor = page["data"][-1]["id"]

print(create_alias("hacker news")["address"])`;

const CLI_INSTALL = `npm install -g ghstmail
ghstmail login`;

const CLI_USAGE = `# The one you will actually use: create an alias and copy it
$ ghstmail new github
github.k7f2q@ghstmail.space
  copied to clipboard  ·  label: github  ·  never expires

# Throwaway that cleans itself up
$ ghstmail new "free trial" --expires 24h

# Did the signup email arrive?
$ ghstmail check github
github.k7f2q@ghstmail.space
  state      active
  received   1
  forwarded  1
  filters    none

# Block a sender across every alias
$ ghstmail filter add spam.example.com

# Pipe-friendly: stdout is only ever the data
$ ghstmail alias list --json | jq -r '.data[] | select(.active) | .address'`;

const CLI_WATCH = `$ ghstmail watch github
Watching github.k7f2q@ghstmail.space every 5s. Ctrl-C to stop.

19:04:11  github.k7f2q@ghstmail.space  received +1  forwarded +1  delivered
19:06:40  github.k7f2q@ghstmail.space  received +1  forwarded +0  not forwarded, check filters`;

function Code({ children, language }) {
  return (
    <figure className="relative my-4 group rounded-xl border border-border bg-[#080705] overflow-hidden">
      <figcaption className="flex items-center justify-between h-8 px-3 border-b border-border/60 bg-foreground/[0.02]">
        <span className="text-[11px] font-mono text-muted-foreground">
          {language}
        </span>
        <CopyButton text={children} />
      </figcaption>
      <pre className="p-4 overflow-x-auto text-[13px] leading-[1.65]">
        <code className="font-mono whitespace-pre text-foreground/85">
          {highlight(children, language)}
        </code>
      </pre>
    </figure>
  );
}

function methodTone(method) {
  if (method === "GET") return "text-sky-400 border-sky-400/30 bg-sky-400/5";
  if (method === "DELETE") return "text-red-400 border-red-400/30 bg-red-400/5";
  return "text-primary border-primary/30 bg-primary/5";
}

function ApiCell({ text }) {
  const { methods, rest } = splitEndpoint(text);
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      {methods.map((method) => (
        <span key={method} className={`text-[10.5px] font-semibold px-1.5 py-0.5 rounded border ${methodTone(method)}`}>
          {method}
        </span>
      ))}
      <code className="font-mono text-[12.5px] text-foreground/90 ml-1">{rest}</code>
    </span>
  );
}

function Endpoint({ method, path, scope }) {
  const tone = methodTone(method);
  return (
    <div className="flex flex-wrap items-center gap-3 py-2.5 border-b border-border/40 last:border-0">
      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${tone} shrink-0`}>{method}</span>
      <code className="text-[13px] font-mono text-foreground">{path}</code>
      {scope && <span className="text-[11px] text-muted-foreground ml-auto font-mono">{scope}</span>}
    </div>
  );
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border/60 pt-10 mb-14">
      <h2 className="group font-display font-bold text-[1.7rem] tracking-tight mb-4 text-foreground">
        <a href={`#${id}`} className="hover:text-primary transition-colors">
          {title}
          <span aria-hidden="true" className="ml-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">#</span>
        </a>
      </h2>
      <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

const NAV = [
  { id: "start", label: "Quickstart" },
  { id: "auth", label: "Authentication" },
  { id: "errors", label: "Errors" },
  { id: "pagination", label: "Pagination" },
  { id: "limits", label: "Rate limits" },
  { id: "idempotency", label: "Idempotency" },
  { id: "aliases", label: "Aliases" },
  { id: "filters", label: "Filters" },
  { id: "sending", label: "Sending mail" },
  { id: "account", label: "Account" },
  { id: "libraries", label: "Your language" },
  { id: "cli", label: "CLI" },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen relative">
      <SiteHeader />
      <div className="max-w-[1180px] mx-auto relative">
        <main className="">
          <div className="relative px-5 sm:px-10 pt-14 pb-14 lg:pt-20 lg:pb-20 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
            <div aria-hidden="true" className="pointer-events-none absolute -z-10 inset-x-0 -top-16 h-[460px] bg-[radial-gradient(closest-side_at_68%_50%,hsl(var(--primary)/0.12),transparent)]" />
            <div>
              <h1 className="font-display font-extrabold tracking-tight leading-[0.98] text-[clamp(2.6rem,5.2vw,4.25rem)]">API reference</h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground max-w-[32em]">
                Create disposable aliases, decide who reaches your inbox, and check
                whether mail arrived. REST over HTTPS, JSON in and out.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href="/dashboard/keys" className="inline-flex h-[46px] items-center rounded-[11px] bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                  Get an API key
                </Link>
                <a href="https://api.ghstmail.space/v1/openapi.json" className="inline-flex h-[46px] items-center rounded-[11px] border border-border bg-card px-5 font-medium hover:border-foreground/30 transition-colors">
                  OpenAPI spec
                </a>
              </div>
              <div className="group mt-6 inline-flex items-center gap-3 rounded-[10px] border border-border bg-card pl-3.5 pr-2 h-10 text-sm">
                <span className="text-muted-foreground">Base URL</span>
                <code className="font-mono text-[12.5px] text-primary">https://api.ghstmail.space/v1</code>
                <CopyButton text="https://api.ghstmail.space/v1" />
              </div>
            </div>
            <TryIt />
          </div>

          <div className="px-5 sm:px-10 pb-14 lg:flex lg:gap-14">
            <SectionNav items={NAV} />

            <div className="min-w-0 flex-1">
              <div className="flex gap-4 rounded-2xl border border-border bg-card p-5 text-[15px] leading-relaxed text-muted-foreground mb-14">
                <svg className="w-6 h-6 shrink-0 text-primary mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2C7.58 2 4 5.58 4 10v9a1 1 0 001.7.7L7.4 18l1.7 1.7a1 1 0 001.4 0L12 18.2l1.5 1.5a1 1 0 001.4 0L16.6 18l1.7 1.7A1 1 0 0020 19v-9c0-4.42-3.58-8-8-8z" />
                  <circle cx="9" cy="10" r="1.5" fill="currentColor" />
                  <circle cx="15" cy="10" r="1.5" fill="currentColor" />
                </svg>
                <p>
                  <span className="text-foreground font-medium">One thing up front.</span>{" "}
                  GhstMail never stores the content of your mail, so no endpoint returns a
                  message, a subject, or a sender. What you get is alias configuration and
                  delivery counters. If mail was received and forwarded, it is in your real
                  inbox. That is the whole design, not a missing feature.
                </p>
              </div>

              <div className="mb-14">
                <h2 className="font-display font-bold text-[1.7rem] tracking-tight mb-4">Everything you can do</h2>
                <div className="border border-border rounded-xl overflow-hidden overflow-x-auto">
                  <table className="w-full text-sm min-w-[640px]">
                    <thead>
                      <tr className="border-b border-border bg-foreground/[0.02] text-left">
                        <th className="px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                          What
                        </th>
                        <th className="px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                          API
                        </th>
                        <th className="px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                          CLI
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      {[
                        ["Create an alias", "POST /v1/aliases", "ghstmail new [label]"],
                        ["List aliases", "GET /v1/aliases", "ghstmail alias list"],
                        ["Read one alias", "GET /v1/aliases/{id}", "ghstmail alias get <ref>"],
                        ["Rename, or set an expiry", "PATCH /v1/aliases/{id}", "ghstmail alias update <ref>"],
                        ["Stop delivery, keep the address", "PATCH … {\"active\": false}", "ghstmail alias disable <ref>"],
                        ["Delete an alias", "DELETE /v1/aliases/{id}", "ghstmail alias rm <ref>"],
                        ["Block a sender by domain", "POST /v1/filters", "ghstmail filter add <domain>"],
                        ["List or remove filters", "GET, DELETE /v1/filters", "ghstmail filter list, rm"],
                        ["Send mail as an alias", "POST /v1/messages", "ghstmail send"],
                        ["Did mail arrive and forward?", "GET /v1/aliases/{id}", "ghstmail check <ref>"],
                        ["Watch delivery live", "GET /v1/aliases (ETag)", "ghstmail watch [ref]"],
                        ["Account and usage totals", "GET /v1/account", "ghstmail account"],
                        ["Inspect or revoke your key", "GET, DELETE /v1/keys/current", "ghstmail whoami, logout"],
                        ["Log in without pasting a key", "POST /v1/device/authorize", "ghstmail login"],
                        ["Check the service is healthy", "GET /v1/health, /v1/ready", "ghstmail doctor"],
                      ].map(([what, api, cli]) => (
                        <tr key={api + cli} className="border-b border-border/40 last:border-0">
                          <td className="px-4 py-2.5">{what}</td>
                          <td className="px-4 py-2.5">
                            <ApiCell text={api} />
                          </td>
                          <td className="px-4 py-2.5">
                            <code className="font-mono text-[12.5px] text-foreground/80 whitespace-nowrap">{cli}</code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  There is no endpoint that returns a received message, a subject, or a sender.
                  Nothing is stored, so there is nothing to return.
                </p>
              </div>

              <Section id="start" title="Quickstart">
                <p>
                  Create a key in{" "}
                  <Link href="/dashboard/keys" className="text-primary hover:underline">
                    the dashboard
                  </Link>
                  , export it, and make your first alias. Two minutes, no SDK.
                </p>
                <Code language="bash">{QUICKSTART}</Code>
                <p>You get the alias back. Mail sent to it lands in your real inbox.</p>
                <Code language="json">{QUICKSTART_RESPONSE}</Code>
                <p>
                  Note the omitted <code className="text-foreground font-mono text-[13px]">Content-Type</code>:
                  curl infers it from <code className="text-foreground font-mono text-[13px]">-d</code>. Every
                  other client should send{" "}
                  <code className="text-foreground font-mono text-[13px]">application/json</code> explicitly,
                  because anything else gets a 415.
                </p>
              </Section>

              <Section id="auth" title="Authentication">
                <p>
                  One API key in a bearer header. Keys look like{" "}
                  <code className="text-foreground font-mono text-[13px]">gm_live_…</code> and are shown once,
                  at creation. We store only a hash, so a lost key is replaced rather than recovered.
                </p>
                <Code language="http">{AUTH_EXAMPLE}</Code>
                <p>
                  Keys carry scopes, and the dashboard lets you narrow them. A key that only reads
                  aliases cannot delete one, which makes it safe to drop into a script you do not
                  fully trust.
                </p>
                <div className="border border-border rounded-xl overflow-hidden my-4">
                  {[
                    ["aliases:read", "List and retrieve aliases"],
                    ["aliases:write", "Create, update and delete aliases"],
                    ["filters:read", "List filters"],
                    ["filters:write", "Create and delete filters"],
                    ["messages:send", "Send mail from your aliases. Never granted by default."],
                  ].map(([scope, description]) => (
                    <div key={scope} className="flex gap-4 px-4 py-2.5 border-b border-border/40 last:border-0 text-sm">
                      <code className="font-mono text-primary text-[13px] w-32 shrink-0">{scope}</code>
                      <span className="text-muted-foreground">{description}</span>
                    </div>
                  ))}
                </div>
                <p>
                  <span className="text-foreground font-medium">Keep keys server-side.</span> CORS is
                  deliberately not enabled, so a browser cannot call this API. That is a guardrail, not
                  an oversight: a key in front-end JavaScript is a key you have published.
                </p>
              </Section>

              <Section id="errors" title="Errors">
                <p>
                  Every failure has the same shape, so you write the handler once. The{" "}
                  <code className="text-foreground font-mono text-[13px]">request_id</code> also appears in
                  our logs, so quote it if you need help.
                </p>
                <Code language="json">{ERROR_EXAMPLE}</Code>
                <div className="border border-border rounded-xl overflow-hidden my-4">
                  {[
                    ["400", "invalid_request_error", "The request itself does not make sense"],
                    ["401", "authentication_error", "Missing, malformed, revoked or expired key"],
                    ["403", "permission_error", "The key lacks the scope for this call"],
                    ["404", "not_found_error", "No such alias, filter, or route"],
                    ["409", "conflict_error", "Address taken, or a key is mid-flight"],
                    ["422", "validation_error", "A parameter failed validation, see param"],
                    ["429", "rate_limit_error", "Slow down, see Retry-After"],
                    ["5xx", "api_error", "Our fault. Safe to retry"],
                  ].map(([status, type, meaning]) => (
                    <div key={status} className="flex gap-4 px-4 py-2.5 border-b border-border/40 last:border-0 text-sm">
                      <code className="font-mono text-foreground text-[13px] w-10 shrink-0">{status}</code>
                      <code className="font-mono text-primary text-[13px] w-44 shrink-0 hidden sm:block">{type}</code>
                      <span className="text-muted-foreground">{meaning}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Section id="pagination" title="Pagination">
                <p>
                  List endpoints return newest first, 20 at a time, up to 100. Page with{" "}
                  <code className="text-foreground font-mono text-[13px]">starting_after</code>, passing the
                  id of the last object you saw. Cursors rather than offsets, so creating an alias
                  mid-loop does not make you skip or repeat one.
                </p>
                <Code language="bash">{PAGINATION_EXAMPLE}</Code>
                <Code language="json">{PAGINATION_RESPONSE}</Code>
                <p>
                  Keep going while{" "}
                  <code className="text-foreground font-mono text-[13px]">has_more</code> is true. There is a
                  complete loop in the Python example below.
                </p>
              </Section>

              <Section id="limits" title="Rate limits">
                <p>
                  120 requests a minute per account. Every response tells you where you stand, so you
                  never have to guess.
                </p>
                <Code language="http">{RATE_HEADERS}</Code>
                <p>
                  <code className="text-foreground font-mono text-[13px]">X-RateLimit-Reset</code> is a Unix
                  timestamp. Go over and you get a 429 with{" "}
                  <code className="text-foreground font-mono text-[13px]">Retry-After</code> in seconds. Back
                  off when <code className="text-foreground font-mono text-[13px]">Remaining</code> gets low
                  rather than after you are refused.
                </p>
                <p>
                  <code className="text-foreground font-mono text-[13px]">GET /v1/aliases</code> also returns
                  an <code className="text-foreground font-mono text-[13px]">ETag</code>. Send it back as{" "}
                  <code className="text-foreground font-mono text-[13px]">If-None-Match</code> and an
                  unchanged list costs you a 304 with no body, which is how the CLI can poll every five
                  seconds politely.
                </p>
              </Section>

              <Section id="idempotency" title="Idempotency">
                <p>
                  Send an <code className="text-foreground font-mono text-[13px]">Idempotency-Key</code> on any
                  POST and a retry is free of consequences. If the first attempt already succeeded you get
                  that same response back, marked{" "}
                  <code className="text-foreground font-mono text-[13px]">Idempotent-Replayed: true</code>,
                  rather than a duplicate alias.
                </p>
                <Code language="bash">{IDEMPOTENCY_EXAMPLE}</Code>
                <p>
                  Any unique string of 8 to 255 characters works; a UUID is the easy choice. Reuse a key
                  with a <em>different</em> body and you get a 422 rather than a surprise, because that is
                  a bug rather than a retry. Keys are remembered for 24 hours.
                </p>
              </Section>

              <Section id="aliases" title="Aliases">
                <div className="border border-border rounded-xl px-4 py-1 my-4">
                  <Endpoint method="GET" path="/v1/aliases" scope="aliases:read" />
                  <Endpoint method="POST" path="/v1/aliases" scope="aliases:write" />
                  <Endpoint method="GET" path="/v1/aliases/{id}" scope="aliases:read" />
                  <Endpoint method="PATCH" path="/v1/aliases/{id}" scope="aliases:write" />
                  <Endpoint method="DELETE" path="/v1/aliases/{id}" scope="aliases:write" />
                </div>
                <p>
                  Every field on create is optional. A{" "}
                  <code className="text-foreground font-mono text-[13px]">label</code> is a note to yourself
                  and also seeds the address, which makes aliases recognisable months later.
                </p>
                <Code language="bash">{CREATE_EXPIRING}</Code>
                <p>
                  Use <code className="text-foreground font-mono text-[13px]">expires_in</code> for seconds
                  from now, or <code className="text-foreground font-mono text-[13px]">expires_at</code> for
                  an exact time. Sending both is an error rather than a coin toss.
                </p>
                <p>
                  To stop mail without giving up the address, set{" "}
                  <code className="text-foreground font-mono text-[13px]">active</code> to false. Reach for
                  this before <code className="text-foreground font-mono text-[13px]">DELETE</code>, which is
                  permanent and takes the reply tokens with it, so old threads can no longer reach you.
                </p>
                <Code language="bash">{DISABLE_ALIAS}</Code>
                <p>
                  <code className="text-foreground font-mono text-[13px]">emails_received</code> and{" "}
                  <code className="text-foreground font-mono text-[13px]">emails_forwarded</code> are the
                  honest answer to &quot;did it arrive?&quot;. A gap between them means a filter caught
                  something.
                </p>
              </Section>

              <Section id="filters" title="Filters">
                <div className="border border-border rounded-xl px-4 py-1 my-4">
                  <Endpoint method="GET" path="/v1/filters" scope="filters:read" />
                  <Endpoint method="POST" path="/v1/filters" scope="filters:write" />
                  <Endpoint method="DELETE" path="/v1/filters/{id}" scope="filters:write" />
                </div>
                <p>
                  Filters match on the sender&apos;s domain. Leave{" "}
                  <code className="text-foreground font-mono text-[13px]">alias_id</code> out and the rule
                  covers every alias you own; set it and the rule is limited to one.
                </p>
                <Code language="bash">{FILTER_EXAMPLE}</Code>
                <p>
                  Blocked mail is counted in{" "}
                  <code className="text-foreground font-mono text-[13px]">emails_received</code> and then
                  dropped, so you can see that something was stopped without it reaching you.
                </p>
              </Section>

              <Section id="sending" title="Sending mail">
                <div className="border border-border rounded-xl px-4 py-1 my-4">
                  <Endpoint method="POST" path="/v1/messages" scope="messages:send" />
                </div>
                <p>
                  Send as one of your aliases. The recipient sees the alias, never your real
                  address, and their reply comes back through the alias to your inbox. The message
                  is DKIM-signed as{" "}
                  <code className="text-foreground font-mono text-[13px]">ghstmail.space</code>.
                </p>
                <Code language="bash">{SEND_EXAMPLE}</Code>
                <p>
                  <code className="text-foreground font-mono text-[13px]">from</code> takes an alias
                  id or address and is resolved server-side against the aliases you own. There is
                  deliberately no way to supply a raw{" "}
                  <code className="text-foreground font-mono text-[13px]">From</code> header, so a
                  key cannot be used to claim an address that is not yours.
                </p>
                <Code language="json">{SEND_RESPONSE}</Code>
                <p>
                  You get <code className="text-foreground font-mono text-[13px]">202</code> once the
                  recipient&apos;s server accepts the message, with{" "}
                  <code className="text-foreground font-mono text-[13px]">accepted</code> and{" "}
                  <code className="text-foreground font-mono text-[13px]">rejected</code> so partial
                  delivery is visible. Send an{" "}
                  <code className="text-foreground font-mono text-[13px]">Idempotency-Key</code> and a
                  retry cannot send twice.
                </p>

                <div className="border border-border rounded-xl p-4 bg-muted/20 text-sm my-5">
                  <div className="text-foreground font-medium mb-2">Limits, and why</div>
                  <ul className="space-y-1.5 list-disc pl-5 text-muted-foreground">
                    <li>
                      <span className="text-foreground">Scope:</span> needs{" "}
                      <code className="font-mono text-[13px]">messages:send</code>, which is not in
                      the default set. No existing key can send.
                    </li>
                    <li>
                      <span className="text-foreground">5 recipients</span> per message, all on one
                      domain. Send separate messages for separate domains.
                    </li>
                    <li>
                      <span className="text-foreground">No recipients on{" "}
                      <code className="font-mono text-[13px]">ghstmail.space</code></span>, which
                      would loop back into the alias machinery.
                    </li>
                    <li>
                      <span className="text-foreground">Carriage returns and newlines</span> are
                      rejected in the subject, so a caller cannot append their own headers.
                    </li>
                    <li>
                      <span className="text-foreground">The alias must be active and unexpired.</span>{" "}
                      A burned alias is not a usable sending identity.
                    </li>
                    <li>
                      <span className="text-foreground">Quotas</span> per hour and per day, per
                      account and per alias. Exceeding them returns 429 with{" "}
                      <code className="font-mono text-[13px]">Retry-After</code>.
                    </li>
                  </ul>
                </div>

                <p>
                  Only the recipient&apos;s <em>domain</em>, a count and a timestamp are recorded, for
                  quota accounting. Not the subject, not the body, not the recipient&apos;s local
                  part. A full recipient log would be a social graph, which is the thing this product
                  exists to avoid.
                </p>
                <p>From the CLI:</p>
                <Code language="bash">{SEND_CLI}</Code>
                <p>
                  <code className="text-foreground font-mono text-[13px]">--dry-run</code> is worth
                  the habit. Nothing about a sent message is stored, so it is the only opportunity to
                  read a message back.
                </p>
              </Section>

              <Section id="account" title="Account">
                <div className="border border-border rounded-xl px-4 py-1 my-4">
                  <Endpoint method="GET" path="/v1/account" />
                  <Endpoint method="GET" path="/v1/keys/current" />
                  <Endpoint method="DELETE" path="/v1/keys/current" />
                  <Endpoint method="GET" path="/v1/health" />
                  <Endpoint method="GET" path="/v1/ready" />
                </div>
                <p>
                  <code className="text-foreground font-mono text-[13px]">/v1/account</code> confirms which
                  account a key belongs to and totals your alias counts, which is the cheapest way to
                  check a key works.{" "}
                  <code className="text-foreground font-mono text-[13px]">DELETE /v1/keys/current</code> lets
                  a key retire itself, which is what the CLI does on logout.
                </p>
                <p>
                  <code className="text-foreground font-mono text-[13px]">/v1/health</code> is liveness and
                  touches nothing. <code className="text-foreground font-mono text-[13px]">/v1/ready</code>{" "}
                  checks the database and queue, and returns 503 when either is unhappy. Point a monitor
                  at the second one.
                </p>
              </Section>

              <Section id="libraries" title="From your language">
                <p>
                  There is no SDK to install, and for an API this size that is a feature. Here is the
                  whole thing in JavaScript.
                </p>
                <Code language="javascript">{JS_EXAMPLE}</Code>
                <p>And in Python, including a pagination loop you can lift as-is.</p>
                <Code language="python">{PY_EXAMPLE}</Code>
                <p>
                  For anything generated, the{" "}
                  <a href="https://api.ghstmail.space/v1/openapi.json" className="text-primary hover:underline">
                    OpenAPI 3.1 document
                  </a>{" "}
                  describes every endpoint.
                </p>
              </Section>

              <Section id="cli" title="Command line">
                <p>
                  The CLI is the fastest way to use any of this. Zero runtime dependencies, and{" "}
                  <code className="text-foreground font-mono text-[13px]">login</code> hands you off to the
                  dashboard to approve, so no key ever touches your shell history.
                </p>
                <Code language="bash">{CLI_INSTALL}</Code>
                <p>
                  <code className="text-foreground font-mono text-[13px]">ghstmail login</code> shows a short
                  code, you approve it while signed in, and the CLI stores the key it is given at mode
                  0600. Revoke it any time from the dashboard.
                </p>
                <Code language="bash">{CLI_USAGE}</Code>
                <p>
                  Data goes to stdout and everything decorative goes to stderr, so{" "}
                  <code className="text-foreground font-mono text-[13px]">EMAIL=$(ghstmail new)</code> gives
                  you exactly an address. Exit codes are distinct too: 3 means log in again, 4 a missing
                  scope, 8 rate limited, 10 network. Enough for a wrapper script to do the right thing.
                </p>
                <p>
                  <code className="text-foreground font-mono text-[13px]">watch</code> is the closest thing
                  to an inbox we can honestly offer. It tails delivery counters, so you can see mail land
                  without us keeping any of it.
                </p>
                <Code language="bash">{CLI_WATCH}</Code>
                <p className="pt-2">
                  <code className="text-foreground font-mono text-[13px]">ghstmail --help</code> lists
                  everything, and <code className="text-foreground font-mono text-[13px]">ghstmail doctor</code>{" "}
                  is the first thing to run when something looks wrong.
                </p>
              </Section>

              <div className="border-t border-border pt-8 mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <Link href="/dashboard/keys" className="text-primary hover:underline">
                  Create an API key
                </Link>
                <a href="https://api.ghstmail.space/v1/openapi.json" className="text-muted-foreground hover:text-foreground transition-colors">
                  OpenAPI spec
                </a>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy policy
                </Link>
                <a href="mailto:privacy@ghstmail.space" className="text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
