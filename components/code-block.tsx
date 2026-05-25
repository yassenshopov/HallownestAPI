"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CodeBlock({
  title,
  code,
  language,
  className,
}: {
  title?: string;
  code: string;
  language?: string;
  className?: string;
}) {
  const [status, setStatus] = React.useState<"idle" | "copied" | "error">("idle");
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const onCopy = async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    timeoutRef.current = setTimeout(() => setStatus("idle"), 1500);
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border/60 bg-card/60 backdrop-blur",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-3 py-1.5">
        <div className="flex items-center gap-2 text-xs">
          {title ? (
            <span className="font-mono text-muted-foreground">{title}</span>
          ) : language ? (
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {language}
            </span>
          ) : null}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopy}
          className="h-7 gap-1.5 px-2 text-xs"
          aria-label={status === "copied" ? "Copied to clipboard" : "Copy code"}
        >
          {status === "copied" ? (
            <Check aria-hidden="true" className="h-3.5 w-3.5" />
          ) : (
            <Copy aria-hidden="true" className="h-3.5 w-3.5" />
          )}
          {status === "copied" ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre
        tabIndex={0}
        className="overflow-x-auto p-4 font-mono text-xs leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:text-[13px]"
      >
        <code>{code}</code>
      </pre>
      <span role="status" aria-live="polite" className="sr-only">
        {status === "copied"
          ? "Copied to clipboard"
          : status === "error"
            ? "Copy failed"
            : ""}
      </span>
    </div>
  );
}
