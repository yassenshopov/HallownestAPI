"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : true;
  const label = mounted
    ? isDark
      ? "Switch to light mode"
      : "Switch to dark mode"
    : "Toggle theme";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
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
