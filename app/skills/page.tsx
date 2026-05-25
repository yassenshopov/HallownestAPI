import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Wind, Flame, Swords, Moon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { skills } from "@/lib/data";
import { GAMES, SKILL_KINDS, type SkillKind } from "@/lib/schema";
import { buildMetadata, collectionPageLd, jsonLdScript } from "@/lib/seo";

const PAGE_TITLE = "Skills";
const PAGE_DESCRIPTION =
  "Movement abilities, spells, nail arts, and dream tools — every Hollow Knight Knight skill with SOUL cost, damage, and acquisition, returned as JSON.";

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: "/skills",
  keywords: [
    "Hollow Knight spells",
    "Hollow Knight nail arts",
    "Vengeful Spirit",
    "Shade Soul",
    "Mothwing Cloak",
    "Monarch Wings",
    "Dream Nail",
    "Hollow Knight skills list",
  ],
});

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const KIND_ORDER: SkillKind[] = ["movement", "spell", "nail-art", "dream"];

function KindIcon({ kind }: { kind: SkillKind }) {
  const cls = "h-3.5 w-3.5";
  switch (kind) {
    case "movement":
      return <Wind aria-hidden="true" className={cls} />;
    case "spell":
      return <Flame aria-hidden="true" className={cls} />;
    case "nail-art":
      return <Swords aria-hidden="true" className={cls} />;
    case "dream":
    default:
      return <Moon aria-hidden="true" className={cls} />;
  }
}

export default function SkillsPage() {
  const byGame = {
    hk: skills.filter((s) => s.game === "hk"),
    silksong: skills.filter((s) => s.game === "silksong"),
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
              path: "/skills",
              items: skills.map((s) => ({ slug: s.slug, name: s.name })),
              itemBasePath: "/skills",
            }),
          ),
        }}
      />
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Skills
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Movement abilities, spells, nail arts, and dream tools. Hit{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
            /api/v1/skill
          </code>{" "}
          for JSON, or filter with{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
            ?kind=spell
          </code>
          .
        </p>
      </header>

      {(["hk", "silksong"] as const).map((game) => {
        const list = byGame[game];
        if (list.length === 0) return null;
        return (
          <section key={game} className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                {GAMES[game].name}
              </h2>
              <Badge variant="secondary" className="font-mono text-xs">
                {list.length} {list.length === 1 ? "entry" : "entries"}
              </Badge>
            </div>

            <div className="space-y-10">
              {KIND_ORDER.map((kind) => {
                const inKind = list.filter((s) => s.kind === kind);
                if (inKind.length === 0) return null;

                return (
                  <section key={kind}>
                    <div className="mb-3 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="inline-flex items-center gap-1.5 border-primary/30 text-xs"
                      >
                        <KindIcon kind={kind} />
                        {SKILL_KINDS[kind].plural}
                      </Badge>
                      <span className="font-mono text-xs text-muted-foreground tabular-nums">
                        {inKind.length}
                      </span>
                    </div>

                    <ul
                      className="grid gap-3 md:grid-cols-2 lg:grid-cols-3"
                      role="list"
                    >
                      {inKind.map((s) => (
                        <li key={s.slug}>
                          <Link
                            href={`/skills/${s.slug}`}
                            className={`group block h-full rounded-lg border border-border/60 bg-card/60 p-4 transition-colors hover:border-primary/40 hover:bg-card ${FOCUS_RING}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-heading text-base font-semibold tracking-tight">
                                {s.name}
                              </h3>
                              <ArrowRight
                                aria-hidden="true"
                                className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                              />
                            </div>
                            {s.effect ? (
                              <p className="mt-1 line-clamp-2 text-sm italic text-muted-foreground">
                                {s.effect}
                              </p>
                            ) : null}
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {typeof s.soulCost === "number" ? (
                                <Badge
                                  variant="outline"
                                  className="font-mono text-xs tabular-nums"
                                >
                                  {s.soulCost}&nbsp;SOUL
                                </Badge>
                              ) : null}
                              {typeof s.damage === "number" ? (
                                <Badge
                                  variant="outline"
                                  className="font-mono text-xs tabular-nums"
                                >
                                  {s.damage}&nbsp;dmg
                                </Badge>
                              ) : null}
                              {s.area ? (
                                <Badge variant="outline" className="text-xs">
                                  {s.area.name}
                                </Badge>
                              ) : null}
                              {!s.verified ? (
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
