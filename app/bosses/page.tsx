import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GAMES } from "@/lib/schema";
import { bosses } from "@/data/bosses";

export const metadata: Metadata = {
  title: "Bosses",
  description:
    "Browse every Hollow Knight and Silksong boss currently indexed in HallownestAPI.",
};

export default function BossesPage() {
  const byGame = {
    hk: bosses.filter((b) => b.game === "hk"),
    silksong: bosses.filter((b) => b.game === "silksong"),
  } as const;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Bosses</h1>
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
              <h2 className="text-xl font-semibold tracking-tight">{GAMES[game].name}</h2>
              <Badge variant="secondary" className="font-mono text-xs">
                {list.length} {list.length === 1 ? "entry" : "entries"}
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {list.map((boss) => (
                <Link key={boss.slug} href={`/bosses/${boss.slug}`} className="group">
                  <Card className="h-full border-border/60 bg-card/60 transition-colors hover:border-primary/40 hover:bg-card">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-lg">{boss.name}</CardTitle>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="line-clamp-3 text-sm text-muted-foreground">{boss.summary}</p>
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
                          <Badge variant="outline" className="font-mono text-xs">
                            {boss.hp.base} HP
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
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
