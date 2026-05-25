import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CodeBlock } from "@/components/code-block";
import { charms } from "@/data/charms";
import { getCharm } from "@/lib/data";
import { GAMES } from "@/lib/schema";
import {
  breadcrumbLd,
  buildMetadata,
  gameEntityLd,
  jsonLdScript,
} from "@/lib/seo";

const FOCUS_RING =
  "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function generateStaticParams() {
  return charms.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCharm(slug);
  if (!c) {
    return buildMetadata({
      title: "Charm not found",
      description: "This charm isn't in HallownestAPI yet.",
      path: `/charms/${slug}`,
      noIndex: true,
    });
  }

  const gameName = GAMES[c.game].name;
  const notchLabel = `${c.notchCost} notch${c.notchCost === 1 ? "" : "es"}`;
  return buildMetadata({
    title: `${c.name} — ${notchLabel} ${gameName} charm`,
    description: `${c.effect} ${c.summary}`,
    path: `/charms/${c.slug}`,
    type: "article",
    ogImage: `/charms/${c.slug}/opengraph-image`,
    keywords: [
      c.name,
      `${c.name} charm`,
      `${c.name} notch cost`,
      `${c.name} location`,
      `${gameName} charms`,
      ...(c.area ? [c.area.name] : []),
    ],
  });
}

export default async function CharmPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const charm = getCharm(slug);
  if (!charm) notFound();

  const upgradeTarget = charm.upgradesTo ? getCharm(charm.upgradesTo) : undefined;
  const upgradeSource = charm.upgradeOf ? getCharm(charm.upgradeOf) : undefined;
  const synergies = charm.synergies
    .map((s) => getCharm(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload is built from a typed constant.
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Charms", path: "/charms" },
              { name: charm.name, path: `/charms/${charm.slug}` },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload is built from a typed constant.
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            gameEntityLd({
              type: "Thing",
              name: charm.name,
              description: `${charm.effect} ${charm.summary}`.trim(),
              path: `/charms/${charm.slug}`,
              game: charm.game,
              image: `/charms/${charm.slug}/opengraph-image`,
              sameAs: [
                ...(charm.wikiUrl ? [charm.wikiUrl] : []),
                ...(charm.sources ?? []),
              ],
            }),
          ),
        }}
      />
      <Breadcrumbs
        items={[
          { label: "Charms", href: "/charms" },
          { label: charm.name },
        ]}
      />

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {GAMES[charm.game].name}
          </Badge>
          <Badge
            variant="secondary"
            className="font-mono text-xs tabular-nums"
          >
            {charm.notchCost}&nbsp;notch{charm.notchCost === 1 ? "" : "es"}
          </Badge>
          {charm.fragile ? (
            <Badge
              variant="outline"
              className="border-amber-500/40 text-xs text-amber-600 dark:text-amber-400"
            >
              fragile
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
        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-balance">
          {charm.name}
        </h1>
        <p className="mt-1 italic text-muted-foreground">{charm.effect}</p>
        <p className="mt-3 max-w-2xl text-balance text-muted-foreground">
          {charm.summary}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {charm.description ? (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">How it works</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {charm.description}
                </p>
              </CardContent>
            </Card>
          ) : null}

          {charm.location ? (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">
                  Where to find it
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {charm.location}
                </p>
              </CardContent>
            </Card>
          ) : null}

          {synergies.length > 0 ? (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Synergies</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-wrap gap-2">
                  {synergies.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/charms/${s.slug}`}
                        className={`inline-flex items-center gap-1 rounded-md border border-border/60 bg-card/60 px-2 py-1 text-xs transition-colors hover:border-primary/40 hover:bg-card ${FOCUS_RING}`}
                      >
                        {s.name}
                        <ArrowRight
                          aria-hidden="true"
                          className="h-3 w-3 text-muted-foreground"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          <CodeBlock
            title={`GET /api/v1/charm/${charm.slug}`}
            language="json"
            code={JSON.stringify(charm, null, 2)}
          />
        </div>

        <aside className="space-y-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Notch cost">
                <span className="font-mono tabular-nums">
                  {charm.notchCost}
                </span>
              </Row>
              {typeof charm.cost === "number" ? (
                <Row label="Price">
                  <span className="font-mono tabular-nums">
                    {charm.cost.toLocaleString()}&nbsp;geo
                  </span>
                </Row>
              ) : null}
              {charm.acquisition ? (
                <Row label="Acquired">
                  <span className="capitalize">{charm.acquisition}</span>
                </Row>
              ) : null}
              {charm.area ? (
                <Row label="Area">
                  <Link
                    href={`/areas/${charm.area.slug}`}
                    className={`text-foreground hover:text-primary ${FOCUS_RING}`}
                  >
                    {charm.area.name}
                  </Link>
                </Row>
              ) : null}
              {charm.merchant ? (
                <Row label="Merchant">
                  <Link
                    href={`/characters/${charm.merchant}`}
                    className={`capitalize text-foreground hover:text-primary ${FOCUS_RING}`}
                  >
                    {charm.merchant.replace(/-/g, " ")}
                  </Link>
                </Row>
              ) : null}
              <Row label="Slug">
                <code className="font-mono text-xs">{charm.slug}</code>
              </Row>
            </CardContent>
          </Card>

          {upgradeTarget || upgradeSource ? (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Upgrade chain</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {upgradeSource ? (
                  <p>
                    Base form:{" "}
                    <Link
                      href={`/charms/${upgradeSource.slug}`}
                      className={`text-foreground hover:text-primary ${FOCUS_RING}`}
                    >
                      {upgradeSource.name}
                    </Link>
                  </p>
                ) : null}
                {upgradeTarget ? (
                  <p>
                    Upgrades to:{" "}
                    <Link
                      href={`/charms/${upgradeTarget.slug}`}
                      className={`text-foreground hover:text-primary ${FOCUS_RING}`}
                    >
                      {upgradeTarget.name}
                    </Link>
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          {charm.wikiUrl || charm.sources?.length ? (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5 text-sm">
                  {charm.wikiUrl ? (
                    <li>
                      <a
                        href={charm.wikiUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={`inline-flex items-center gap-1 text-muted-foreground hover:text-foreground ${FOCUS_RING}`}
                      >
                        <ExternalLink
                          aria-hidden="true"
                          className="h-3.5 w-3.5"
                        />
                        Hollow Knight Wiki
                      </a>
                    </li>
                  ) : null}
                  {charm.sources?.map((s) => (
                    <li key={s}>
                      <a
                        href={s}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={`inline-flex items-center gap-1 text-muted-foreground hover:text-foreground ${FOCUS_RING}`}
                      >
                        <ExternalLink
                          aria-hidden="true"
                          className="h-3.5 w-3.5"
                        />
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

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{children}</span>
    </div>
  );
}
