"use client";

import * as React from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

// Narrowed type for the View Transitions API (not yet in lib.dom for all targets).
type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => {
    ready: Promise<void>;
    finished: Promise<void>;
    skipTransition: () => void;
  };
};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // next-themes hydration-safety pattern: don't read resolvedTheme until
  // we've confirmed we're on the client, otherwise SSR/CSR labels mismatch.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : true;
  const label = mounted
    ? isDark
      ? "Switch to light mode"
      : "Switch to dark mode"
    : "Toggle theme";

  const handleToggle = React.useCallback(() => {
    const next = isDark ? "light" : "dark";

    const doc = document as DocumentWithViewTransition;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Fallback: instant swap when the API is unavailable or the user prefers
    // reduced motion. Covers Firefox, Safari < 18, and accessibility cases.
    if (typeof doc.startViewTransition !== "function" || reduceMotion) {
      setTheme(next);
      return;
    }

    const rect = buttonRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    // Furthest corner from the click origin — the radius the circle must reach
    // to cover every pixel of the viewport.
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = doc.startViewTransition(() => {
      // Force next-themes' state + the <html class> mutation to commit inside
      // the snapshot window so the "new" layer captures the post-swap colors.
      flushSync(() => setTheme(next));
    });

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 550,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {
        // Animation can be rejected if the transition is skipped — ignore.
      });
  }, [isDark, setTheme]);

  return (
    <Button
      ref={buttonRef}
      data-theme-toggle=""
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      onClick={handleToggle}
      className="relative h-9 w-9"
    >
      <Sun
        aria-hidden="true"
        className="h-4 w-4 transition-[transform,opacity] duration-200 motion-reduce:transition-none dark:scale-0 dark:-rotate-90 dark:opacity-0"
      />
      <Moon
        aria-hidden="true"
        className="absolute h-4 w-4 scale-0 rotate-90 opacity-0 transition-[transform,opacity] duration-200 motion-reduce:transition-none dark:scale-100 dark:rotate-0 dark:opacity-100"
      />
    </Button>
  );
}
