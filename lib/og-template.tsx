import { ImageResponse } from "next/og";

// Site palette pulled from `app/globals.css` :root.dark — kept as raw hex
// because `ImageResponse` runs Satori, which doesn't understand `oklch()`.
const BG = "#0c0d11";
const SURFACE = "#15171c";
const PRIMARY = "#7fb8e0";
const FG = "#f6f7f9";
const FG_MUTED = "#a0a4ad";
const BORDER = "rgba(255, 255, 255, 0.08)";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export type OgStat = { label: string; value: string };

/**
 * Renders a per-entity Open Graph card with a consistent frame:
 *   eyebrow / title / subtitle / stat row / footer brand mark.
 * Everything is inline-styled flexbox so Satori is happy.
 */
export function renderEntityOg({
  eyebrow,
  title,
  subtitle,
  stats,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  stats: OgStat[];
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: OG_SIZE.width,
          height: OG_SIZE.height,
          background: BG,
          color: FG,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          padding: 80,
          fontFamily:
            '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          backgroundImage: [
            `radial-gradient(circle at 78% 22%, ${PRIMARY}33 0%, transparent 45%)`,
            `radial-gradient(circle at 18% 88%, ${PRIMARY}1f 0%, transparent 50%)`,
          ].join(", "),
        }}
      >
        {/* Sigil — top-right */}
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

        {/* Eyebrow / tag line */}
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
          <span>{eyebrow}</span>
        </div>

        <div style={{ display: "flex", flexGrow: 1 }} />

        {/* Title + subtitle block */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1
            style={{
              fontSize: title.length > 22 ? 92 : 116,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: 0,
              textShadow: `0 2px 24px ${PRIMARY}1f`,
              // Wrap long titles instead of overflowing.
              maxWidth: 1020,
            }}
          >
            {title}
          </h1>
          {subtitle ? (
            <p
              style={{
                fontSize: 32,
                lineHeight: 1.3,
                color: FG_MUTED,
                margin: "24px 0 0",
                maxWidth: 1020,
                // Keep the OG card tidy when summaries are long.
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>

        {/* Stats strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginTop: 48,
            paddingTop: 28,
            borderTop: `1px solid ${BORDER}`,
            fontSize: 22,
            color: FG_MUTED,
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
          }}
        >
          {stats.map((s, i) => (
            <div
              key={`${s.label}-${i}`}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
              }}
            >
              <span style={{ color: PRIMARY }}>{s.value}</span>
              <span
                style={{
                  fontSize: 18,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                {s.label}
              </span>
              {i < stats.length - 1 ? (
                <span style={{ marginLeft: 16 }}>·</span>
              ) : null}
            </div>
          ))}
          <div style={{ display: "flex", flexGrow: 1 }} />
          <span style={{ color: FG }}>hallownestapi.dev</span>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
