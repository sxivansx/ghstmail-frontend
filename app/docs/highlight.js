/**
 * A small syntax highlighter for the handful of languages this page uses.
 *
 * Runs at render time on the server, so highlighted code costs the visitor no
 * JavaScript. A single-pass scanner rather than chained replaces: each rule is
 * tried at the current position, the first match wins, and unmatched
 * characters are consumed one at a time as plain text. That ordering is what
 * keeps a keyword inside a string from being highlighted separately.
 */

const CLASSES = {
  comment: "text-[#8f8777] italic",
  string: "text-[#c5cf8b]",
  number: "text-[#ffa55e]",
  keyword: "text-primary",
  command: "text-primary",
  flag: "text-[#a9bccd]",
  variable: "text-[#a9bccd]",
  property: "text-[#e2d2a4]",
  literal: "text-[#ffa55e]",
  operator: "text-[#a9bccd]",
  punctuation: "text-foreground/60",
  header: "text-[#a9bccd]",
  prompt: "text-[#8f8777]",
  url: "text-[#7dcfff] underline decoration-[#7dcfff]/20 underline-offset-2",
};

// Shared string forms. Ordered longest-first so a triple quote cannot be read
// as an empty pair.
const SINGLE = /^'(?:[^'\\\n]|\\.)*'?/;
const DOUBLE = /^"(?:[^"\\\n]|\\.)*"?/;
const BACKTICK = /^`(?:[^`\\]|\\.)*`?/;

const RULES = {
  bash: [
    ["comment", /^#[^\n]*/],
    ["prompt", /^\$(?= )/],
    // Matched before `command`, otherwise the "ghstmail" inside
    // https://api.ghstmail.space would be highlighted as a command.
    ["url", /^https?:\/\/[^\s'"\\)]+/],
    ["string", SINGLE],
    ["string", DOUBLE],
    ["variable", /^\$\{[^}\n]*\}|^\$[A-Za-z_][A-Za-z0-9_]*/],
    ["flag", /^--?[A-Za-z][\w-]*/],
    [
      "command",
      /^\b(?:curl|npm|npx|ghstmail|jq|git|export|echo|node|chmod|set|EMAIL)\b/,
    ],
    ["operator", /^[|>]/],
    ["punctuation", /^[\\{}[\]()]/],
  ],

  json: [
    // A quoted string immediately followed by a colon is a key, not a value.
    ["property", /^"(?:[^"\\\n]|\\.)*"(?=\s*:)/],
    ["string", DOUBLE],
    ["literal", /^\b(?:true|false|null)\b/],
    ["number", /^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/],
    ["punctuation", /^[{}[\],:]/],
  ],

  javascript: [
    ["comment", /^\/\/[^\n]*|^\/\*[\s\S]*?\*\//],
    ["string", BACKTICK],
    ["string", SINGLE],
    ["string", DOUBLE],
    [
      "keyword",
      /^\b(?:const|let|var|async|await|function|return|if|else|throw|new|for|of|in|try|catch|finally|export|import|from|class|typeof)\b/,
    ],
    ["literal", /^\b(?:true|false|null|undefined|this)\b/],
    ["number", /^\b\d+(?:\.\d+)?\b/],
    ["command", /^\b(?:fetch|console|JSON|Error|crypto|process|require)\b/],
    // The dot is part of the token: a lookbehind cannot see past position 0 of
    // the remaining slice, so `.name` is matched as one unit.
    ["property", /^\.[A-Za-z_$][\w$]*/],
    ["operator", /^(?:=>|===|!==|\?\?|&&|\|\||[=+\-*/<>!?:])/],
    ["punctuation", /^[{}[\]();,.]/],
  ],

  python: [
    ["comment", /^#[^\n]*/],
    ["string", /^(?:f|r|rf|fr)?"""[\s\S]*?"""/],
    ["string", /^(?:f|r|rf|fr)?'''[\s\S]*?'''/],
    ["string", /^(?:f|r|rf|fr)?'(?:[^'\\\n]|\\.)*'?/],
    ["string", /^(?:f|r|rf|fr)?"(?:[^"\\\n]|\\.)*"?/],
    [
      "keyword",
      /^\b(?:import|from|def|return|if|not|while|for|in|yield|raise|class|with|as|try|except|finally|and|or|pass|lambda)\b/,
    ],
    ["literal", /^\b(?:True|False|None|self)\b/],
    ["number", /^\b\d+(?:\.\d+)?\b/],
    ["command", /^\b(?:print|requests|os|uuid|str|dict|session)\b/],
    ["property", /^\.[A-Za-z_][\w]*/],
    ["operator", /^(?:->|==|!=|>=|<=|[=+\-*/<>:])/],
    ["punctuation", /^[{}[\]();,.]/],
  ],

  http: [
    ["header", /^[A-Za-z][A-Za-z-]*(?=:)/],
    ["string", DOUBLE],
    ["number", /^\b\d+\b/],
    ["punctuation", /^:/],
  ],
};

/**
 * Returns an array of React children: plain strings for unstyled runs and
 * <span> elements for tokens.
 */
export function highlight(source, language) {
  const rules = RULES[language];
  if (!rules) return source;

  const nodes = [];
  let plain = "";
  let rest = source;
  let key = 0;

  const flushPlain = () => {
    if (plain) {
      nodes.push(plain);
      plain = "";
    }
  };

  while (rest.length > 0) {
    let matched = false;

    for (const [kind, pattern] of rules) {
      const found = pattern.exec(rest);
      if (found && found[0].length > 0) {
        flushPlain();
        nodes.push(
          <span key={key++} className={CLASSES[kind]}>
            {found[0]}
          </span>
        );
        rest = rest.slice(found[0].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      plain += rest[0];
      rest = rest.slice(1);
    }
  }

  flushPlain();
  return nodes;
}
