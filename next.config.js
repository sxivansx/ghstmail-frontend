// Pages that only make sense signed in, or mid-flow. They stay crawlable (see
// app/robots.js) so search engines can read this header and drop them.
const PRIVATE_PAGES = [
  "/dashboard",
  "/dashboard/:path*",
  "/device",
  "/auth/:path*",
  "/forgot-password",
  "/reset-password",
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return PRIVATE_PAGES.map((source) => ({
      source,
      headers: [{ key: "X-Robots-Tag", value: "noindex" }],
    }));
  },
};

module.exports = nextConfig;
