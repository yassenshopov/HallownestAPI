import Link from "next/link";

import { Separator } from "@/components/ui/separator";

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

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <nav className="space-y-6 text-sm">
            {sections.map((sec) => (
              <div key={sec.title}>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {sec.title}
                </h4>
                <ul className="space-y-1">
                  {sec.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block rounded-md px-2 py-1 text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
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
