import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  /** Visible label and the value used for the JSON-LD `name`. */
  label: string;
  /**
   * Path the crumb links to. Omit on the final crumb (current page) — that
   * item is rendered as plain text with `aria-current="page"` but is still
   * included in the structured data.
   */
  href?: string;
};

// Fallback mirrors the value in `app/layout.tsx` so structured data still
// resolves to an absolute URL during local dev.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:112";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function toAbsolute(href: string): string {
  try {
    return new URL(href, SITE_URL).toString();
  } catch {
    return href;
  }
}

/**
 * SEO-compliant breadcrumb trail. Renders:
 *   - an accessible `<nav aria-label="Breadcrumb">` with an ordered list,
 *   - a `schema.org/BreadcrumbList` JSON-LD payload for search engines.
 *
 * `Home` is always prepended as the first crumb so the structured data
 * starts at the site root, per Google's guidance.
 */
export function Breadcrumbs({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  const trail: BreadcrumbItem[] = [{ label: "Home", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: toAbsolute(item.href) } : {}),
    })),
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("mb-6", className)}
    >
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {trail.map((item, i) => {
          const isLast = i === trail.length - 1;
          return (
            <li
              key={`${item.label}-${i}`}
              className="inline-flex items-center gap-1"
            >
              {i > 0 ? (
                <ChevronRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60"
                />
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-md px-1 -mx-1 transition-colors hover:text-foreground",
                    FOCUS_RING,
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "max-w-[18ch] truncate sm:max-w-none",
                    isLast && "font-medium text-foreground",
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </nav>
  );
}
