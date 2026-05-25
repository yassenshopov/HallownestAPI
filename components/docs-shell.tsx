import * as React from "react";

import { cn } from "@/lib/utils";

export function DocsPage({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-10", className)}>
      <header className="space-y-2">
        {eyebrow ? (
          <p className="font-mono text-xs uppercase tracking-wider text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {description ? (
          <p className="max-w-2xl text-balance text-muted-foreground">{description}</p>
        ) : null}
      </header>
      <div className="space-y-8 text-[15px] leading-relaxed text-foreground/90">
        {children}
      </div>
    </div>
  );
}

export function DocsSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
