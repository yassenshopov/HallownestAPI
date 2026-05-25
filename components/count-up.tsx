"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type CountUpProps = {
  value: number;
  /** Animation duration in ms. Default tuned to feel snappy but readable. */
  duration?: number;
  /** Render delay so a row of cards staggers in nicely. */
  delay?: number;
  /** Optional locale for the formatter; defaults to `undefined` (user locale). */
  locale?: string;
  className?: string;
};

// useLayoutEffect logs a warning during SSR; swap to a no-op there so we can
// still use the layout phase on the client to suppress the first-paint flash.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/**
 * Animated counter that climbs from 0 to `value` once on mount.
 *
 * Notes:
 *  - SSR renders the final value so non-JS visitors (and the first paint
 *    before hydration finishes) see the correct number — no zero flash.
 *  - On the client, the reset to 0 happens inside a layout effect so the
 *    browser paints `0` (not the SSR final) once hydration commits, then RAF
 *    drives the climb back to `value`.
 *  - Honors `prefers-reduced-motion`: skips the animation and snaps to the
 *    target immediately.
 *  - Uses an ease-out curve so the climb decelerates into place.
 *  - Renders numbers via `Intl.NumberFormat` so locales with grouping (e.g.
 *    `1,234`) line up with the final static value.
 */
export function CountUp({
  value,
  duration = 1200,
  delay = 0,
  locale,
  className,
}: CountUpProps) {
  const [display, setDisplay] = React.useState(value);

  const formatter = React.useMemo(
    () => new Intl.NumberFormat(locale),
    [locale],
  );

  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    let startTime: number | null = null;
    let cancelled = false;

    setDisplay(0);

    const timer = window.setTimeout(() => {
      if (cancelled) return;
      function step(now: number) {
        if (cancelled) return;
        if (startTime === null) startTime = now;
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(value * eased));
        if (progress < 1) {
          raf = requestAnimationFrame(step);
        } else {
          setDisplay(value);
        }
      }
      raf = requestAnimationFrame(step);
    }, delay);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, duration, delay]);

  return (
    <span className={cn("tabular-nums slashed-zero", className)}>
      {formatter.format(display)}
    </span>
  );
}
