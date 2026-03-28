import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "GhstMail — Your email, invisible.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle radial glow */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(202, 160, 40, 0.12) 0%, transparent 70%)",
          }}
        />

        {/* Ghost icon */}
        <svg
          width="72"
          height="72"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ca9f28"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2C7.58 2 4 5.58 4 10v9a1 1 0 001.7.7L7.4 18l1.7 1.7a1 1 0 001.4 0L12 18.2l1.5 1.5a1 1 0 001.4 0L16.6 18l1.7 1.7A1 1 0 0020 19v-9c0-4.42-3.58-8-8-8z" />
          <circle cx="9" cy="10" r="1.5" fill="#ca9f28" />
          <circle cx="15" cy="10" r="1.5" fill="#ca9f28" />
        </svg>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "32px",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#f2f2f2",
              letterSpacing: "-2px",
              lineHeight: 1.1,
              display: "flex",
              gap: "16px",
            }}
          >
            <span>Your email.</span>
            <span style={{ color: "#ca9f28" }}>Invisible.</span>
          </div>

          <div
            style={{
              fontSize: "24px",
              color: "#a3a3a3",
              marginTop: "20px",
              fontWeight: 400,
            }}
          >
            Disposable email aliases that protect your real inbox.
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "32px",
            fontSize: "18px",
            color: "#737373",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#a3a3a3",
              fontWeight: 600,
            }}
          >
            ghstmail.space
          </div>
          <div style={{ color: "#404040" }}>|</div>
          <div>Free forever</div>
          <div style={{ color: "#404040" }}>|</div>
          <div>No tracking</div>
          <div style={{ color: "#404040" }}>|</div>
          <div>Chrome extension</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
