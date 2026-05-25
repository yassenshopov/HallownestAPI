import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CodeBlock } from "@/components/code-block";
import { areas } from "@/data/areas";
import {
  bosses,
  characters,
  charms,
  getArea,
  subareasOf,
} from "@/lib/data";
import { AREA_KINDS, GAMES } from "@/lib/schema";
import {
  breadcrumbLd,
  buildMetadata,
  gameEntityLd,
  jsonLdScript,
} from "@/lib/seo";

const FOCUS_RING =
  "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArea(slug);
  if (!a) {
    return buildMetadata({
      title: "Area not found",
      description: "This area isn't in HallownestAPI yet.",
      path: `/areas/${slug}`,
      noIndex: true,
    });
  }

  const gameName = GAMES[a.game].name;
  const kindName = AREA_KINDS[a.kind].name;
  return buildMetadata({
    title: `${a.name} — ${gameName} ${kindName.toLowerCase()}`,
    description: a.summary,
    path: `/areas/${a.slug}`,
    type: "article",
    ogImage: `/areas/${a.slug}/opengraph-image`,
    keywords: [
      a.name,
      `${a.name} map`,
      `${a.name} ${gameName}`,
      `${gameName} ${kindName.toLowerCase()}`,
      ...(a.stagStation ? [`${a.stagStation} stag station`] : []),
    ],
  });
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();

  const parent = area.parent ? getArea(area.parent) : undefined;
  const subareas = subareasOf(area.slug);

  // Cross-reference other entity types by area slug — useful sidebars on
  // every area page without forcing the API consumer to do the join.
  const localBosses = bosses.filter((b) => b.area.slug === area.slug);
  const localCharacters = characters.filter(
    (c) => c.area?.slug === area.slug,
  );
  const localCharms = charms.filter((c) => c.area?.slug === area.slug);

  const crumbs: BreadcrumbItem[] = [
    { label: "Areas", href: "/areas" },
    ...(parent
      ? [{ label: parent.name, href: `/areas/${parent.slug}` }]
      : []),
    { label: area.name },
  ];

  const breadcrumbPath: { name: string; path: string }[] = [
    { name: "Home", path: "/" },
    { name: "Areas", path: "/areas" },
    ...(parent ? [{ name: parent.name, path: `/areas/${parent.slug}` }] : []),
    { name: area.name, path: `/areas/${area.slug}` },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload is built from a typed constant.
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbLd(breadcrumbPath)),
        }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload is built from a typed constant.
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            gameEntityLd({
              type: "Place",
              name: area.name,
              description: area.summary,
              path: `/areas/${area.slug}`,
              game: area.game,
              image: `/areas/${area.slug}/opengraph-image`,
              sameAs: [
                ...(area.wikiUrl ? [area.wikiUrl] : []),
                ...(area.sources ?? []),
              ],
            }),
          ),
        }}
      />
      <Breadcrumbs items={crumbs} />

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {GAMES[area.game].name}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {AREA_KINDS[area.kind].name}
          </Badge>
          {!area.verified ? (
            <Badge
              variant="outline"
              className="border-amber-500/40 text-xs text-amber-600 dark:text-amber-400"
            >
              unverified
            </Badge>
          ) : null}
        </div>
        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-balance">
          {area.name}
        </h1>
        {parent ? (
          <p className="mt-1 text-sm uppercase tracking-wider text-muted-foreground">
            Sub-area of{" "}
            <Link
              href={`/areas/${parent.slug}`}
              className={`text-foreground hover:text-primary ${FOCUS_RING}`}
            >
              {parent.name}
            </Link>
          </p>
        ) : null}
        <p className="mt-3 max-w-2xl text-balance text-muted-foreground">
          {area.summary}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {area.description ? (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {area.description}
                </p>
              </CardContent>
            </Card>
          ) : null}

          {subareas.length > 0 ? (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Sub-areas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {subareas.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/areas/${s.slug}`}
                        className={`flex items-center justify-between gap-2 rounded-md border border-border/60 px-3 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-card ${FOCUS_RING}`}
                      >
                        <span>{s.name}</span>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          {AREA_KINDS[s.kind].name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          {localBosses.length + localCharacters.length + localCharms.length >
          0 ? (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">What&apos;s here</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {localBosses.length > 0 ? (
                  <CrossRefList
                    label="Bosses"
                    items={localBosses.map((b) => ({
                      slug: b.slug,
                      name: b.name,
                      href: `/bosses/${b.slug}`,
                    }))}
                  />
                ) : null}
                {localCharacters.length > 0 ? (
                  <CrossRefList
                    label="Characters"
                    items={localCharacters.map((c) => ({
                      slug: c.slug,
                      name: c.name,
                      href: `/characters/${c.slug}`,
                    }))}
                  />
                ) : null}
                {localCharms.length > 0 ? (
                  <CrossRefList
                    label="Charms"
                    items={localCharms.map((c) => ({
                      slug: c.slug,
                      name: c.name,
                      href: `/charms/${c.slug}`,
                    }))}
                  />
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          {area.music ? (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Music</CardTitle>
              </CardHeader>
              <CardContent>
                {area.music.spotifyTrackId ? (
                  <iframe
                    title={`Spotify player for "${area.music.title}" from the Hollow Knight OST`}
                    src={`https://open.spotify.com/embed/track/${area.music.spotifyTrackId}?utm_source=hollowapi`}
                    width="100%"
                    height={152}
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    className="block w-full rounded-xl border-0"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground">{area.music.title}</span>{" "}
                    — ambient loop, not released as a standalone track.
                  </p>
                )}
              </CardContent>
            </Card>
          ) : null}

          <CodeBlock
            title={`GET /api/v1/area/${area.slug}`}
            language="json"
            code={JSON.stringify(
              {
                ...area,
                subareas: subareas.map((s) => ({
                  slug: s.slug,
                  name: s.name,
                  kind: s.kind,
                })),
              },
              null,
              2,
            )}
          />
        </div>

        <aside className="space-y-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Kind">
                <span>{AREA_KINDS[area.kind].name}</span>
              </Row>
              {area.stagStation ? (
                <Row label="Stag">
                  <span>{area.stagStation}</span>
                </Row>
              ) : null}
              <Row label="Slug">
                <code className="font-mono text-xs">{area.slug}</code>
              </Row>
            </CardContent>
          </Card>

          {area.connectsTo.length > 0 ? (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5 text-sm">
                  {area.connectsTo.map((s) => (
                    <li key={s}>
                      <Link
                        href={`/areas/${s}`}
                        className={`text-muted-foreground transition-colors hover:text-foreground ${FOCUS_RING}`}
                      >
                        {s
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          {area.wikiUrl || area.sources?.length ? (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5 text-sm">
                  {area.wikiUrl ? (
                    <li>
                      <a
                        href={area.wikiUrl}
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
                  {area.sources?.map((s) => (
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

function CrossRefList({
  label,
  items,
}: {
  label: string;
  items: { slug: string; name: string; href: string }[];
}) {
  return (
    <div>
      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((it) => (
          <li key={it.slug}>
            <Link
              href={it.href}
              className={`inline-flex rounded-md border border-border/60 bg-card/60 px-2 py-1 text-xs transition-colors hover:border-primary/40 hover:bg-card ${FOCUS_RING}`}
            >
              {it.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
