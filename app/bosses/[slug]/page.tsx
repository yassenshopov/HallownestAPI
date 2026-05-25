import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CodeBlock } from "@/components/code-block";
import { bosses } from "@/data/bosses";
import { getBoss } from "@/lib/data";
import { GAMES } from "@/lib/schema";

const FOCUS_RING =
  "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function generateStaticParams() {
  return bosses.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const boss = getBoss(slug);
  if (!boss) return { title: "Boss not found" };
  return {
    title: boss.name,
    description: boss.summary,
    openGraph: boss.image?.url
      ? {
          images: [{ url: boss.image.url, alt: boss.name }],
        }
      : undefined,
  };
}

export default async function BossPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const boss = getBoss(slug);
  if (!boss) notFound();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/bosses"
        className={`mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground ${FOCUS_RING}`}
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> All bosses
      </Link>

      <header className="mb-8 grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {GAMES[boss.game].name}
            </Badge>
            {boss.optional ? (
              <Badge variant="secondary" className="text-xs">
                optional
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
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance">
            {boss.name}
          </h1>
          <p className="mt-3 max-w-2xl text-balance text-muted-foreground">
            {boss.summary}
          </p>
        </div>

        {boss.image?.url ? (
          <figure className="sm:w-64">
            <div className="relative aspect-square overflow-hidden rounded-lg border border-border/60 bg-muted/30">
              <Image
                src={boss.image.url}
                alt={`Artwork of ${boss.name} from the Hollow Knight Wiki`}
                fill
                sizes="(min-width: 640px) 256px, 100vw"
                className="object-contain p-3"
                priority
                unoptimized
              />
            </div>
            <figcaption className="mt-1.5 text-[10px] text-muted-foreground">
              Image: {boss.image.attribution ?? "Hollow Knight Wiki"} · {boss.image.license ?? "CC BY-SA 3.0"}
            </figcaption>
          </figure>
        ) : null}
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {boss.phases?.length ? (
            <Card className="border-border/60">
              <CardHeader>
                <h2 className="text-base font-semibold tracking-tight">Phases</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="space-y-4">
                  {boss.phases.map((p, i) => (
                    <li key={`${p.name}-${i}`}>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-xs text-muted-foreground tabular-nums">
                          {i + 1}.
                        </span>
                        <h3 className="font-medium">{p.name}</h3>
                      </div>
                      {p.description ? (
                        <p className="mt-1 pl-6 text-sm text-muted-foreground">
                          {p.description}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ) : null}

          {boss.attacks?.length ? (
            <Card className="border-border/60">
              <CardHeader>
                <h2 className="text-base font-semibold tracking-tight">Attacks</h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {boss.attacks.map((a, i) => (
                    <li key={`${a.name}-${i}`}>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-medium">{a.name}</span>
                        {typeof a.damage === "number" ? (
                          <span className="font-mono text-xs text-muted-foreground tabular-nums">
                            {a.damage}&nbsp;dmg
                          </span>
                        ) : null}
                      </div>
                      {a.description ? (
                        <p className="text-sm text-muted-foreground">{a.description}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          {boss.hunterJournal?.notes ? (
            <Card className="border-border/60">
              <CardHeader>
                <h2 className="text-base font-semibold tracking-tight">
                  Hunter’s notes
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-sm italic text-muted-foreground">
                  {boss.hunterJournal.notes}
                </p>
              </CardContent>
            </Card>
          ) : null}

          <CodeBlock
            title={`GET /api/v1/boss/${boss.slug}`}
            language="json"
            code={JSON.stringify(boss, null, 2)}
          />
        </div>

        <aside className="space-y-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {boss.hp ? (
                <Row label="HP">
                  <span className="font-mono tabular-nums">
                    {Object.entries(boss.hp)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(" · ")}
                  </span>
                </Row>
              ) : null}
              {typeof boss.geo === "number" ? (
                <Row label="Geo drop">
                  <span className="font-mono tabular-nums">{boss.geo}</span>
                </Row>
              ) : null}
              <Row label="Area">
                <span>{boss.area.name}</span>
              </Row>
              <Row label="Slug">
                <code className="font-mono text-xs">{boss.slug}</code>
              </Row>
            </CardContent>
          </Card>

          {boss.rewards?.length ? (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5 text-sm">
                  {boss.rewards.map((r) => (
                    <li key={r} className="text-muted-foreground">
                      {r}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          {boss.wikiUrl || boss.sources?.length ? (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5 text-sm">
                  {boss.wikiUrl ? (
                    <li>
                      <a
                        href={boss.wikiUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={`inline-flex items-center gap-1 text-muted-foreground hover:text-foreground ${FOCUS_RING}`}
                      >
                        <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                        Hollow Knight Wiki
                      </a>
                    </li>
                  ) : null}
                  {boss.sources?.map((s) => (
                    <li key={s}>
                      <a
                        href={s}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={`inline-flex items-center gap-1 text-muted-foreground hover:text-foreground ${FOCUS_RING}`}
                      >
                        <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                        {new URL(s).hostname}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
        </aside>
      </div>

      <Separator className="my-10" />
      <p className="text-xs text-muted-foreground">
        Data is fan-contributed and may be inaccurate.{" "}
        <Link
          href="/docs/contributing"
          className={`underline underline-offset-4 hover:text-foreground ${FOCUS_RING}`}
        >
          Suggest a correction
        </Link>
        .
      </p>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{children}</span>
    </div>
  );
}
