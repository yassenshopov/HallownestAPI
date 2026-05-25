import { cn } from "@/lib/utils";

/**
 * Hollow Knight "soul mote" backdrop.
 *
 * Renders a fixed, viewport-sized layer with:
 *   1. A volumetric light cone shining from the top.
 *   2. A wash of mist seeping up from the bottom.
 *   3. A field of glowing dust motes that drift slowly upward — inspired by
 *      the spore particles in Greenpath / Fungal Wastes and the soul wisps
 *      around the player in the Abyss.
 *
 * Implementation notes:
 *   - Pure server component. Every mote's position / size / timing is derived
 *     from a deterministic hash so the SSR and CSR markup match exactly and
 *     reloads don't re-shuffle the field.
 *   - Animation is GPU-friendly: only `transform` and `opacity` change per
 *     frame, both promoted via `will-change`.
 *   - Respects `prefers-reduced-motion` (motes are hidden via CSS in
 *     `globals.css`; the static beam + mist stay so the page still feels
 *     atmospheric without movement).
 */

// Single seed → pseudo-random number in [0, 1). Stable across runs so the
// field doesn't shift on every render.
function rand(seed: number): number {
  const x = Math.sin(seed) * 43758.5453;
  return x - Math.floor(x);
}

type Mote = {
  key: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
};

function buildField(count: number): Mote[] {
  return Array.from({ length: count }, (_, i) => {
    const k = i + 1;
    return {
      key: i,
      // 0–100% across the viewport
      left: rand(k * 12.9898) * 100,
      // 1px–4px specks
      size: 1 + rand(k * 7.123) * 3,
      // 22s–50s lifetime — slow drift, not stars-warp
      duration: 22 + rand(k * 3.141) * 28,
      // Negative delay staggers the field so on first paint the whole column
      // is already populated instead of starting empty at the bottom.
      delay: -rand(k * 5.555) * (22 + rand(k * 3.141) * 28),
      // -20px to +20px lateral sway over the climb
      drift: (rand(k * 17.7) - 0.5) * 40,
      // 0.35–0.85 peak opacity
      opacity: 0.35 + rand(k * 29.31) * 0.5,
    };
  });
}

// 36 was the sweet spot in testing — dense enough to read as "alive",
// sparse enough to disappear into the page on a laptop screen.
const MOTES = buildField(36);

export function Atmosphere({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div className="hk-light-beam absolute inset-x-0 top-0 h-[55vh]" />
      <div className="hk-mist absolute inset-x-0 bottom-0 h-[45vh]" />

      {MOTES.map((m) => (
        <span
          key={m.key}
          className="hk-mote"
          style={{
            left: `${m.left.toFixed(3)}%`,
            width: `${m.size.toFixed(2)}px`,
            height: `${m.size.toFixed(2)}px`,
            // Custom props consumed by the keyframe in globals.css.
            ["--mote-drift" as string]: `${m.drift.toFixed(2)}px`,
            ["--mote-opacity" as string]: m.opacity.toFixed(2),
            animationDuration: `${m.duration.toFixed(2)}s`,
            animationDelay: `${m.delay.toFixed(2)}s`,
          }}
        />
      ))}
    </div>
  );
}
