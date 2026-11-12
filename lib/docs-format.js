const METHOD_LIST = /^((?:GET|POST|PATCH|PUT|DELETE)(?:,\s*(?:GET|POST|PATCH|PUT|DELETE))*)\s+(.*)$/;

export function splitEndpoint(text) {
  const match = text.match(METHOD_LIST);
  if (!match) return { methods: [], rest: text };
  return { methods: match[1].split(/,\s*/), rest: match[2] };
}

export function sectionId(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
