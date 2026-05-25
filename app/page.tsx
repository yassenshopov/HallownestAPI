import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Coffee,
  Database,
  GitBranch,
  ScrollText,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import { GlobalSearch, type SearchItem } from "@/components/global-search";
import { HollowMark } from "@/components/hollow-mark";
import { areas } from "@/data/areas";
import { bosses } from "@/data/bosses";
import { characters } from "@/data/characters";
import { charms } from "@/data/charms";
import { skills } from "@/data/skills";
import { CHARACTER_KINDS, type CharacterKind } from "@/lib/schema";
import { apiReferenceLd, buildMetadata, jsonLdScript } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  path: "/",
  // Root layout already exposes the full default title; rely on it.
  description:
    "A free, open-source REST API for Hollow Knight and Silksong data — bosses, charms, areas, characters, and skills. JSON in, JSON out, no API key required.",
});

const sampleResponse = `{
  "slug": "false-knight",
  "name": "False Knight",
  "game": "hk",
  "hp": { "base": 300 },
  "geo": 200,
  "area": {
    "slug": "forgotten-crossroads",
    "name": "Forgotten Crossroads"
  },
  "phases": [
    { "name": "Armoured rampage" },
    { "name": "Exposed maggot" }
  ]
}`;

const sampleFetch = `// Fetch a single boss
const res = await fetch(
  "https://hallownestapi.dev/api/v1/boss/false-knight",
);
const boss = await res.json();`;

export default function HomePage() {
  const hkCount = bosses.filter((b) => b.game === "hk").length;
  const ssCount = bosses.filter((b) => b.game === "silksong").length;
  const enemyCount = characters.filter(
    (c) => c.kind === ("enemy" satisfies CharacterKind),
  ).length;
  const npcCount = characters.length - enemyCount;
  const regionCount = areas.filter((a) => a.kind === "region").length;
  const subareaCount = areas.length - regionCount;
  // Surfaced collection types on the landing grid — keep in sync with /api/v1.
  const totalEndpoints = 11;

  // Flat, serializable search index built server-side and handed to the
  // client search component. We avoid sending full entity payloads — just
  // the fields needed to render a row and link out.
  const searchItems: SearchItem[] = [
    ...bosses.map((b) => ({
      type: "boss" as const,
      slug: b.slug,
      name: b.name,
      href: `/bosses/${b.slug}`,
      sub: b.area.name,
      game: b.game,
    })),
    ...characters.map((c) => ({
      type: "character" as const,
      slug: c.slug,
      name: c.name,
      href: `/characters/${c.slug}`,
      sub: c.role ?? CHARACTER_KINDS[c.kind].name,
      game: c.game,
    })),
    ...areas.map((a) => ({
      type: "area" as const,
      slug: a.slug,
      name: a.name,
      href: `/areas/${a.slug}`,
      sub: a.kind === "subarea" ? "Sub-area" : "Region",
      game: a.game,
    })),
    ...charms.map((c) => ({
      type: "charm" as const,
      slug: c.slug,
      name: c.name,
      href: `/charms/${c.slug}`,
      sub: c.effect,
      game: c.game,
    })),
    ...skills.map((s) => ({
      type: "skill" as const,
      slug: s.slug,
      name: s.name,
      href: `/skills/${s.slug}`,
      sub: s.effect,
      game: s.game,
    })),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload is built from a typed constant.
        dangerouslySetInnerHTML={{ __html: jsonLdScript(apiReferenceLd()) }}
      />
      <section className="relative isolate overflow-hidden">
        {/* Faint stone-wall grid — pulled way back so it reads as texture
            under the global Atmosphere mist instead of competing with it. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_70%)] dark:opacity-30"
        />
        {/* Hollow mark watermark, floating behind the headline — same trick
            Hollow Knight uses with the giant sigils in the background of the
            City of Tears fountain plaza. */}
        <HollowMark
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-12 -z-10 h-64 w-64 -translate-x-1/2 text-foreground/[0.04] sm:top-16 sm:h-80 sm:w-80"
        />

        <div className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pt-28">
          <div className="flex flex-col items-center text-center">
            <Badge variant="outline" className="mb-6 gap-1.5 border-primary/30 bg-primary/5 text-foreground">
              <Sparkles aria-hidden="true" className="h-3 w-3 text-primary" />
              <span className="text-xs">v0&nbsp;·&nbsp;early preview</span>
            </Badge>

            <h1 className="max-w-3xl text-balance font-heading text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              An open API for{" "}
              <span
                className="bg-gradient-to-br from-primary to-foreground/70 bg-clip-text text-transparent"
                translate="no"
              >
                Hollow Knight &amp; Silksong
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
              Bosses, charms, areas, items — structured, versioned, free. A fan-made,
              non-commercial data layer for the games. Inspired by PokeAPI.
            </p>

            {/* Global search — surfaces every entity (boss/character/area/
                charm/skill) in one place. Doubles as the primary CTA on
                landing because most folks arrive looking for one specific
                thing. ⌘K focuses it from anywhere. */}
            <div className="mt-8 w-full">
              <GlobalSearch items={searchItems} />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/docs" className={buttonVariants({ size: "lg" })}>
                Read the docs{" "}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                href="/bosses"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Browse bosses
              </Link>
            </div>

            <div className="mt-12 grid w-full max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Bosses"
                value={bosses.length}
                sub={`${hkCount} HK · ${ssCount} Silksong`}
              />
              <StatCard
                label="Characters"
                value={characters.length}
                sub={`${npcCount} NPCs · ${enemyCount} enemies`}
              />
              <StatCard
                label="Areas"
                value={areas.length}
                sub={`${regionCount} regions · ${subareaCount} sub-areas`}
              />
              <StatCard
                label="Charms"
                value={charms.length}
                sub={`${skills.length} skills · ${totalEndpoints} endpoints`}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              One <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-base">fetch</code> away from
              every boss.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Predictable URLs. JSON in, JSON out. Validated with Zod on the way in and out, so the
              shape never surprises you.
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              <Feature icon={<Database className="h-4 w-4" />}>
                Strongly-typed schema for bosses, areas, and rewards.
              </Feature>
              <Feature icon={<GitBranch className="h-4 w-4" />}>
                Open data. Every entity is a git-reviewed PR.
              </Feature>
              <Feature icon={<ScrollText className="h-4 w-4" />}>
                Generated docs from the same Zod schema that runs the API.
              </Feature>
            </ul>
          </div>

          <div className="space-y-4">
            <CodeBlock title="GET /api/v1/boss/false-knight" code={sampleResponse} language="json" />
            <CodeBlock title="JavaScript / TypeScript" code={sampleFetch} language="ts" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Start here
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A few jumping-off points while v0 is still small.
            </p>
          </div>
          <Link
            href="/docs"
            className={`${buttonVariants({ variant: "ghost" })} hidden sm:inline-flex`}
          >
            All docs <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <LinkCard
            href="/docs"
            title="Quickstart"
            body="Make your first request in under a minute."
          />
          <LinkCard
            href="/bosses"
            title="Browse bosses"
            body="46 bosses, each with HP, phases, attacks, and a JSON payload."
          />
          <LinkCard
            href="/characters"
            title="Browse characters"
            body="NPCs, merchants, dream warriors, and Hunter's Journal entries."
          />
          <LinkCard
            href="/areas"
            title="Browse areas"
            body="Regions and sub-areas with connection graphs and what's inside."
          />
          <LinkCard
            href="/charms"
            title="Browse charms"
            body="All 45 charm slots — notch cost, location, synergies, and upgrades."
          />
          <LinkCard
            href="/skills"
            title="Browse skills"
            body="Spells, nail arts, dream tools, and movement abilities."
          />
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 lg:px-8">
          <HollowMark className="h-10 w-10 text-primary" />
          <h2 className="max-w-2xl text-balance font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            A community project, made by and for the people who love these games.
          </h2>
          <p className="max-w-2xl text-balance text-muted-foreground">
            HallownestAPI is unaffiliated with Team Cherry. We host facts (HP, locations,
            IDs) and link out to wikis for art and lore. PRs welcome.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/docs/contributing"
              className={buttonVariants({ variant: "outline" })}
            >
              How to contribute
            </Link>
            <Link href="/docs" className={buttonVariants()}>
              Get started
            </Link>
            {/* Tip jar — keeps the project non-commercial while still letting
                people who want to chip in for hosting / data curation do so. */}
            <a
              href={siteConfig.buyMeACoffeeUrl}
              target="_blank"
              rel="noreferrer noopener"
              className={buttonVariants({ variant: "ghost" })}
            >
              <Coffee aria-hidden="true" className="h-4 w-4" />
              Buy me a coffee
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: number | string;
  sub: string;
}) {
  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur">
      <CardHeader className="pb-1">
        <CardTitle className="font-mono text-3xl font-semibold tracking-tight">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}

function Feature({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md border border-border/60 bg-muted text-primary">
        {icon}
      </span>
      <span className="text-foreground/90">{children}</span>
    </li>
  );
}

function LinkCard({
  href,
  title,
  body,
}: {
  href: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-lg border border-border/60 bg-card/60 p-5 transition-colors hover:border-primary/40 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-heading font-medium tracking-tight">{title}</h3>
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        />
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </Link>
  );
}
