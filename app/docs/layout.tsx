"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const sections = [
  {
    title: "Getting started",
    items: [
      { href: "/docs", label: "Introduction" },
      { href: "/docs/quickstart", label: "Quickstart" },
    ],
  },
  {
    title: "Reference",
    items: [
      { href: "/docs/endpoints", label: "Endpoints" },
      { href: "/docs/schema", label: "Schema" },
    ],
  },
  {
    title: "Project",
    items: [
      { href: "/docs/contributing", label: "Contributing" },
      { href: "/docs/legal", label: "Legal & attribution" },
    ],
  },
];

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <nav aria-label="Docs" className="space-y-6 text-sm">
            {sections.map((sec) => (
              <div key={sec.title}>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {sec.title}
                </h4>
                <ul className="space-y-1">
                  {sec.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "block rounded-md px-2 py-1 transition-colors",
                            FOCUS_RING,
                            active
                              ? "bg-accent text-foreground"
                              : "text-foreground/80 hover:bg-accent hover:text-foreground",
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            <Separator className="my-4" />
            <p className="px-2 text-xs text-muted-foreground">
              These docs are early — please open an issue if anything is unclear.
            </p>
          </nav>
        </aside>

        <article className="prose-docs min-w-0">{children}</article>
      </div>
    </div>
  );
}
