import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Favicon — a square cropped version of the HollowMark sigil rendered onto
 * the same dark slate background as the OG image so the browser tab matches
 * social previews.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0c0d11",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
        }}
      >
        <svg
          width={22}
          height={22}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7fb8e0"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2 L8 8 H6 L4 14 L8 22 H16 L20 14 L18 8 H16 Z" />
          <path d="M9 11.5 L9 14" />
          <path d="M15 11.5 L15 14" />
          <path d="M12 4 L12 7" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
