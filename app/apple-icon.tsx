import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon — larger, padded version of the favicon so iOS home-screen
 * shortcuts get a clean rounded square instead of a tightly cropped sigil.
 */
export default function AppleIcon() {
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
          // iOS already masks to a rounded square, but keep the inner art
          // centred with comfortable margins so it survives the mask.
        }}
      >
        <svg
          width={120}
          height={120}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7fb8e0"
          strokeWidth={1.4}
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
