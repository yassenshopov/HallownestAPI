import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, GitBranch } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { areas } from "@/lib/data";
import { AREA_KINDS, GAMES } from "@/lib/schema";
import { buildMetadata, collectionPageLd, jsonLdScript } from "@/lib/seo";

const PAGE_TITLE = "Areas";
const PAGE_DESCRIPTION =
  "Regions and sub-areas of Hallownest with their connections, stag stations, ambient music, and what's inside — exposed as JSON via HallownestAPI.";

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: "/areas",
  keywords: [
    "Hallownest map",
    "Hollow Knight areas",
    "Hollow Knight regions",
    "Forgotten Crossroads",
    "Greenpath",
    "City of Tears",
    "Deepnest",
    "Kingdom's Edge",
    "Hollow Knight stag stations",
  ],
});

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function AreasPage() {
  const byGame = {
    hk: areas.filter((a) => a.game === "hk"),
    silksong: areas.filter((a) => a.game === "silksong"),
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
              path: "/areas",
              items: areas.map((a) => ({ slug: a.slug, name: a.name })),
              itemBasePath: "/areas",
            }),
          ),
        }}
      />
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Areas
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Regions of Hallownest and their named sub-areas. Hit{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
            /api/v1/area
          </code>{" "}
          for JSON, or filter sub-areas with{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
            ?parent=greenpath
          </code>
          .
        </p>
      </header>

      {(["hk", "silksong"] as const).map((game) => {
        const gameList = byGame[game];
        if (gameList.length === 0) return null;
        const regions = gameList.filter((a) => a.kind === "region");

        return (
          <section key={game} className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                {GAMES[game].name}
              </h2>
              <Badge variant="secondary" className="font-mono text-xs">
                {gameList.length} {gameList.length === 1 ? "entry" : "entries"}
              </Badge>
            </div>

            <ul
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              role="list"
            >
              {regions.map((region) => {
                const subareas = gameList.filter(
                  (a) => a.parent === region.slug,
                );
                return (
                  <li key={region.slug}>
                    <Link
                      href={`/areas/${region.slug}`}
                      className={`group block h-full rounded-lg border border-border/60 bg-card/60 p-5 transition-colors hover:border-primary/40 hover:bg-card ${FOCUS_RING}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Badge
                            variant="outline"
                            className="mb-2 inline-flex items-center gap-1.5 border-primary/30 text-xs"
                          >
                            <MapPin
                              aria-hidden="true"
                              className="h-3 w-3"
                            />
                            {AREA_KINDS.region.name}
                          </Badge>
                          <h3 className="font-heading text-lg font-semibold tracking-tight">
                            {region.name}
                          </h3>
                        </div>
                        <ArrowRight
                          aria-hidden="true"
                          className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                        />
                      </div>
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {region.summary}
                      </p>
                      {subareas.length > 0 ? (
                        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <GitBranch
                            aria-hidden="true"
                            className="h-3 w-3"
                          />
                          {subareas.length} sub-area
                          {subareas.length === 1 ? "" : "s"}
                        </p>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
