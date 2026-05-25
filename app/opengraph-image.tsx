import { ImageResponse } from "next/og";

import { bossBySlug } from "@/data/bosses";

export const alt =
  "HallownestAPI — an open API for Hollow Knight & Silksong";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Site palette pulled from `app/globals.css` :root.dark — kept as raw hex
// because `ImageResponse` runs Satori, which doesn't understand `oklch()`.
const BG = "#0c0d11";
const SURFACE = "#15171c";
const PRIMARY = "#7fb8e0";
const FG = "#f6f7f9";
const FG_MUTED = "#a0a4ad";
const BORDER = "rgba(255, 255, 255, 0.08)";

export default async function OgImage() {
  // Boss count is part of the value prop on the strip — keep it honest
  // by reading it off the actual registry at build time.
  const bossCount = bossBySlug.size;

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          background: BG,
          color: FG,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          padding: 80,
          fontFamily:
            '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          // Two stacked radial gradients evoke the vessel-with-halo silhouette
          // without relying on copyrighted artwork.
          backgroundImage: [
            `radial-gradient(circle at 78% 22%, ${PRIMARY}33 0%, transparent 45%)`,
            `radial-gradient(circle at 18% 88%, ${PRIMARY}1f 0%, transparent 50%)`,
          ].join(", "),
        }}
      >
        {/* HollowMark sigil — top-right corner */}
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 96,
            height: 96,
            borderRadius: 20,
            background: SURFACE,
            border: `1px solid ${BORDER}`,
          }}
        >
          <svg
            width={64}
            height={64}
            viewBox="0 0 24 24"
            fill="none"
            stroke={PRIMARY}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2 L8 8 H6 L4 14 L8 22 H16 L20 14 L18 8 H16 Z" />
            <path d="M9 11.5 L9 14" />
            <path d="M15 11.5 L15 14" />
            <path d="M12 4 L12 7" />
          </svg>
        </div>

        {/* Block tag near the top-left, mirrors the "v0" pill in the site nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 22,
            color: FG_MUTED,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              display: "flex",
              width: 28,
              height: 2,
              background: PRIMARY,
            }}
          />
          <span>Hollow Knight · Silksong</span>
        </div>

        {/* Spacer pushes the title block toward vertical centre */}
        <div style={{ display: "flex", flexGrow: 1 }} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1
            style={{
              fontSize: 124,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              margin: 0,
              // Subtle ink-on-paper depth without leaning on system fonts.
              textShadow: `0 2px 24px ${PRIMARY}1f`,
            }}
          >
            HallownestAPI
          </h1>
          <p
            style={{
              fontSize: 40,
              lineHeight: 1.25,
              color: FG_MUTED,
              margin: "28px 0 0",
              maxWidth: 920,
            }}
          >
            An open API for Hollow Knight & Silksong
          </p>
        </div>

        {/* Bottom strip: stats in a monospaced rhythm */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginTop: 56,
            paddingTop: 28,
            borderTop: `1px solid ${BORDER}`,
            fontSize: 26,
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
            color: PRIMARY,
          }}
        >
          <span>{bossCount} bosses</span>
          <span style={{ color: FG_MUTED }}>·</span>
          <span>REST + JSON</span>
          <span style={{ color: FG_MUTED }}>·</span>
          <span>Open source</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
