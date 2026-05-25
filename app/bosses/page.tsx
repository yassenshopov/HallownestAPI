import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { WikiImage } from "@/components/wiki-image";
import { GAMES } from "@/lib/schema";
import { bosses } from "@/lib/data";

export const metadata: Metadata = {
  title: "Bosses",
  description:
    "Browse every Hollow Knight and Silksong boss currently indexed in HallownestAPI.",
};

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function BossesPage() {
  const byGame = {
    hk: bosses.filter((b) => b.game === "hk"),
    silksong: bosses.filter((b) => b.game === "silksong"),
  } as const;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Bosses
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Every boss currently indexed. Click one to see the full payload, or hit{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
            /api/v1/boss
          </code>{" "}
          for the JSON.
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

            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" role="list">
              {list.map((boss) => (
                <li key={boss.slug}>
                  <Link
                    href={`/bosses/${boss.slug}`}
                    className={`group block h-full overflow-hidden rounded-lg border border-border/60 bg-card/60 transition-colors hover:border-primary/40 hover:bg-card ${FOCUS_RING}`}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted/40">
                      {boss.image?.url ? (
                        <WikiImage
                          src={boss.image.url}
                          alt={`Artwork of ${boss.name} from the Hollow Knight Wiki`}
                          fill
                          sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
                          className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                          unoptimized
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 grid place-items-center text-xs text-muted-foreground"
                        >
                          no image
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-heading text-lg font-semibold tracking-tight">
                          {boss.name}
                        </h3>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                      </div>
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {boss.summary}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="outline" className="text-xs">
                          {boss.area.name}
                        </Badge>
                        {boss.optional ? (
                          <Badge variant="secondary" className="text-xs">
                            optional
                          </Badge>
                        ) : null}
                        {boss.hp?.base ? (
                          <Badge
                            variant="outline"
                            className="font-mono text-xs tabular-nums"
                          >
                            {boss.hp.base}&nbsp;HP
                          </Badge>
                        ) : null}
                        {!boss.verified ? (
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
