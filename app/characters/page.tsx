import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldAlert, ScrollText, Coins, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { characters } from "@/lib/data";
import {
  CHARACTER_KINDS,
  type CharacterKind,
  GAMES,
} from "@/lib/schema";
import { buildMetadata, collectionPageLd, jsonLdScript } from "@/lib/seo";

const PAGE_TITLE = "Characters";
const PAGE_DESCRIPTION =
  "NPCs, merchants, dream warriors, and Hunter's Journal enemies of Hallownest — every character with their kind, area, and combat stats, exposed as JSON.";

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: "/characters",
  keywords: [
    "Hollow Knight NPCs",
    "Hollow Knight merchants",
    "Hollow Knight enemies",
    "Hunter's Journal",
    "Dream Warriors",
    "Hallownest characters",
  ],
});

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

// Render kinds in this fixed order on the page (most player-facing first).
const KIND_ORDER: CharacterKind[] = ["npc", "merchant", "warrior", "enemy"];

function KindIcon({ kind }: { kind: CharacterKind }) {
  const cls = "h-3.5 w-3.5";
  switch (kind) {
    case "enemy":
      return <ShieldAlert aria-hidden="true" className={cls} />;
    case "merchant":
      return <Coins aria-hidden="true" className={cls} />;
    case "warrior":
      return <Sparkles aria-hidden="true" className={cls} />;
    case "npc":
    default:
      return <ScrollText aria-hidden="true" className={cls} />;
  }
}

export default function CharactersPage() {
  const byGame = {
    hk: characters.filter((c) => c.game === "hk"),
    silksong: characters.filter((c) => c.game === "silksong"),
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
              path: "/characters",
              items: characters.map((c) => ({ slug: c.slug, name: c.name })),
              itemBasePath: "/characters",
            }),
          ),
        }}
      />
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Characters
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          NPCs, shopkeepers, dream warriors, and the bestiary of Hallownest&apos;s
          enemies. Grouped by kind. Hit{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
            /api/v1/character
          </code>{" "}
          for the JSON, or filter with{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
            ?kind=enemy
          </code>
          .
        </p>
      </header>

      {(["hk", "silksong"] as const).map((game) => {
        const gameList = byGame[game];
        if (gameList.length === 0) return null;
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

            <div className="space-y-10">
              {KIND_ORDER.map((kind) => {
                const list = gameList.filter((c) => c.kind === kind);
                if (list.length === 0) return null;

                return (
                  <section key={kind}>
                    <div className="mb-3 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="inline-flex items-center gap-1.5 border-primary/30 text-xs"
                      >
                        <KindIcon kind={kind} />
                        {CHARACTER_KINDS[kind].plural}
                      </Badge>
                      <span className="font-mono text-xs text-muted-foreground tabular-nums">
                        {list.length}
                      </span>
                    </div>

                    <ul
                      className="grid gap-3 md:grid-cols-2 lg:grid-cols-3"
                      role="list"
                    >
                      {list.map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={`/characters/${c.slug}`}
                            className={`group block h-full rounded-lg border border-border/60 bg-card/60 p-4 transition-colors hover:border-primary/40 hover:bg-card ${FOCUS_RING}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-heading text-base font-semibold tracking-tight">
                                {c.name}
                              </h3>
                              <ArrowRight
                                aria-hidden="true"
                                className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                              />
                            </div>
                            {c.role ? (
                              <p className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">
                                {c.role}
                              </p>
                            ) : null}
                            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                              {c.summary}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {c.area ? (
                                <Badge variant="outline" className="text-xs">
                                  {c.area.name}
                                </Badge>
                              ) : null}
                              {c.kind === "enemy" && typeof c.hp === "number" ? (
                                <Badge
                                  variant="outline"
                                  className="font-mono text-xs tabular-nums"
                                >
                                  {c.hp}&nbsp;HP
                                </Badge>
                              ) : null}
                              {c.isBoss ? (
                                <Badge variant="secondary" className="text-xs">
                                  also a boss
                                </Badge>
                              ) : null}
                              {!c.verified ? (
                                <Badge
                                  variant="outline"
                                  className="border-amber-500/40 text-xs text-amber-600 dark:text-amber-400"
                                >
                                  unverified
                                </Badge>
                              ) : null}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
