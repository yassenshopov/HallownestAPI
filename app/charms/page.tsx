import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { charms } from "@/lib/data";
import { GAMES } from "@/lib/schema";
import { buildMetadata, collectionPageLd, jsonLdScript } from "@/lib/seo";

const PAGE_TITLE = "Charms";
const PAGE_DESCRIPTION =
  "Every Hollow Knight charm — notch cost, effect, location, synergies, and the Fragile / Unbreakable / Grimm Troupe upgrade chains, exposed as JSON.";

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: "/charms",
  keywords: [
    "Hollow Knight charms list",
    "charm notch cost",
    "Hollow Knight charm synergies",
    "Fragile Heart",
    "Unbreakable charms",
    "Void Heart",
    "Kingsoul",
    "Grimm Troupe charms",
  ],
});

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function CharmsPage() {
  const byGame = {
    hk: charms.filter((c) => c.game === "hk"),
    silksong: charms.filter((c) => c.game === "silksong"),
  } as const;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload is built from a typed constant.
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            collectionPageLd({
              name: `${PAGE_TITLE} · HallownestAPI`,
              description: PAGE_DESCRIPTION,
              path: "/charms",
              items: charms.map((c) => ({ slug: c.slug, name: c.name })),
              itemBasePath: "/charms",
            }),
          ),
        }}
      />
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Charms
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Hallownest&apos;s charm collection — every notch and trade-off. Hit{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
            /api/v1/charm
          </code>{" "}
          for JSON, or narrow with{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
            ?notchCost=2
          </code>
          .
        </p>
      </header>

      {(["hk", "silksong"] as const).map((game) => {
        const list = byGame[game];
        if (list.length === 0) return null;
        return (
          <section key={game} className="mb-12">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                {GAMES[game].name}
              </h2>
              <Badge variant="secondary" className="font-mono text-xs">
                {list.length} {list.length === 1 ? "entry" : "entries"}
              </Badge>
            </div>

            <ul
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              role="list"
            >
              {list.map((charm) => (
                <li key={charm.slug}>
                  <Link
                    href={`/charms/${charm.slug}`}
                    className={`group block h-full overflow-hidden rounded-lg border border-border/60 bg-card/60 transition-colors hover:border-primary/40 hover:bg-card ${FOCUS_RING}`}
                  >
                    <div className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-heading text-lg font-semibold tracking-tight">
                          {charm.name}
                        </h3>
                        <ArrowRight
                          aria-hidden="true"
                          className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                        />
                      </div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {charm.effect}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge
                          variant="outline"
                          className="font-mono text-xs tabular-nums"
                        >
                          {charm.notchCost}&nbsp;notch
                          {charm.notchCost === 1 ? "" : "es"}
                        </Badge>
                        {charm.fragile ? (
                          <Badge
                            variant="outline"
                            className="border-amber-500/40 text-xs text-amber-600 dark:text-amber-400"
                          >
                            fragile
                          </Badge>
                        ) : null}
                        {charm.area ? (
                          <Badge variant="outline" className="text-xs">
                            {charm.area.name}
                          </Badge>
                        ) : null}
                        {!charm.verified ? (
                          <Badge
                            variant="outline"
                            className="border-amber-500/40 text-xs text-amber-600 dark:text-amber-400"
                          >
                            unverified
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
