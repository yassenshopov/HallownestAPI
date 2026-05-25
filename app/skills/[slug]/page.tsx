import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CodeBlock } from "@/components/code-block";
import { skills } from "@/data/skills";
import { getSkill } from "@/lib/data";
import { GAMES, SKILL_KINDS } from "@/lib/schema";
import {
  breadcrumbLd,
  buildMetadata,
  gameEntityLd,
  jsonLdScript,
} from "@/lib/seo";

const FOCUS_RING =
  "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function generateStaticParams() {
  return skills.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getSkill(slug);
  if (!s) {
    return buildMetadata({
      title: "Skill not found",
      description: "This skill isn't in HallownestAPI yet.",
      path: `/skills/${slug}`,
      noIndex: true,
    });
  }

  const gameName = GAMES[s.game].name;
  const kindName = SKILL_KINDS[s.kind].name;
  return buildMetadata({
    title: `${s.name} — ${gameName} ${kindName.toLowerCase()}`,
    description: s.summary,
    path: `/skills/${s.slug}`,
    type: "article",
    ogImage: `/skills/${s.slug}/opengraph-image`,
    keywords: [
      s.name,
      `${s.name} skill`,
      `${s.name} acquisition`,
      `${gameName} ${kindName.toLowerCase()}`,
      ...(typeof s.soulCost === "number" ? [`${s.name} SOUL cost`] : []),
    ],
  });
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) notFound();

  const upgradeTarget = skill.upgradesTo ? getSkill(skill.upgradesTo) : undefined;
  const upgradeSource = skill.upgradeOf ? getSkill(skill.upgradeOf) : undefined;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload is built from a typed constant.
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Skills", path: "/skills" },
              { name: skill.name, path: `/skills/${skill.slug}` },
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
              name: skill.name,
              description: skill.summary,
              path: `/skills/${skill.slug}`,
              game: skill.game,
              image: `/skills/${skill.slug}/opengraph-image`,
              sameAs: [
                ...(skill.wikiUrl ? [skill.wikiUrl] : []),
                ...(skill.sources ?? []),
              ],
            }),
          ),
        }}
      />
      <Breadcrumbs
        items={[
          { label: "Skills", href: "/skills" },
          { label: skill.name },
        ]}
      />

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {GAMES[skill.game].name}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {SKILL_KINDS[skill.kind].name}
          </Badge>
          {!skill.verified ? (
            <Badge
              variant="outline"
              className="border-amber-500/40 text-xs text-amber-600 dark:text-amber-400"
            >
              unverified
            </Badge>
          ) : null}
        </div>
        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-balance">
          {skill.name}
        </h1>
        {skill.effect ? (
          <p className="mt-1 italic text-muted-foreground">{skill.effect}</p>
        ) : null}
        <p className="mt-3 max-w-2xl text-balance text-muted-foreground">
          {skill.summary}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {skill.description ? (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">How it works</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {skill.description}
                </p>
              </CardContent>
            </Card>
          ) : null}

          {skill.acquisition ? (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">How to get it</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {skill.acquisition}
                </p>
              </CardContent>
            </Card>
          ) : null}

          <CodeBlock
            title={`GET /api/v1/skill/${skill.slug}`}
            language="json"
            code={JSON.stringify(skill, null, 2)}
          />
        </div>

        <aside className="space-y-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Kind">
                <span>{SKILL_KINDS[skill.kind].name}</span>
              </Row>
              {typeof skill.soulCost === "number" ? (
                <Row label="SOUL cost">
                  <span className="font-mono tabular-nums">
                    {skill.soulCost}
                  </span>
                </Row>
              ) : null}
              {typeof skill.damage === "number" ? (
                <Row label="Damage">
                  <span className="font-mono tabular-nums">{skill.damage}</span>
                </Row>
              ) : null}
              {skill.area ? (
                <Row label="Area">
                  <Link
                    href={`/areas/${skill.area.slug}`}
                    className={`text-foreground hover:text-primary ${FOCUS_RING}`}
                  >
                    {skill.area.name}
                  </Link>
                </Row>
              ) : null}
              <Row label="Slug">
                <code className="font-mono text-xs">{skill.slug}</code>
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
                      href={`/skills/${upgradeSource.slug}`}
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
                      href={`/skills/${upgradeTarget.slug}`}
                      className={`text-foreground hover:text-primary ${FOCUS_RING}`}
                    >
                      {upgradeTarget.name}
                    </Link>
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          {skill.wikiUrl || skill.sources?.length ? (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5 text-sm">
                  {skill.wikiUrl ? (
                    <li>
                      <a
                        href={skill.wikiUrl}
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
                  {skill.sources?.map((s) => (
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
