import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CodeBlock } from "@/components/code-block";
import { DocsPage, DocsSection } from "@/components/docs-shell";

export const metadata: Metadata = {
  title: "Endpoints",
  description: "Reference for every HallownestAPI v1 endpoint.",
};

export default function EndpointsPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Docs", href: "/docs" },
          { label: "Endpoints" },
        ]}
      />
      <DocsPage
        eyebrow="Reference"
        title="Endpoints"
        description="HallownestAPI v1 — REST, no auth, JSON responses."
      >
      <DocsSection title="Base URL">
        <CodeBlock language="bash" code={`https://hallownestapi.dev/api/v1`} />
      </DocsSection>

      <DocsSection title="Conventions">
        <ul className="list-disc space-y-1 pl-5">
          <li>Slugs are kebab-case ASCII (e.g. <code className="font-mono">false-knight</code>).</li>
          <li>List endpoints accept <code className="font-mono">limit</code> (1–100, default 20) and <code className="font-mono">offset</code> (default 0).</li>
          <li>Errors return JSON with an <code className="font-mono">error</code> code and a human <code className="font-mono">message</code> or <code className="font-mono">details</code>.</li>
          <li>All responses are cached at the edge — typically 1h with SWR.</li>
        </ul>
      </DocsSection>

      <Endpoint
        method="GET"
        path="/api/v1"
        description="Root index. Lists available endpoints."
        example={`{
  "name": "HallownestAPI",
  "version": "v1",
  "endpoints": { "bosses": ".../boss", "boss": ".../boss/{slug}" }
}`}
      />

      <Endpoint
        method="GET"
        path="/api/v1/boss"
        description="Paginated list of bosses. Filterable."
        params={[
          { name: "game", type: "hk | silksong", desc: "Filter by game." },
          { name: "search", type: "string", desc: "Substring match on name, slug, or area." },
          { name: "limit", type: "number", desc: "1–100, default 20." },
          { name: "offset", type: "number", desc: "Default 0." },
        ]}
        example={`{
  "count": 4,
  "next": null,
  "previous": null,
  "results": [
    {
      "slug": "false-knight",
      "name": "False Knight",
      "game": "hk",
      "area": { "slug": "forgotten-crossroads", "name": "Forgotten Crossroads" },
      "optional": false,
      "url": "https://hallownestapi.dev/api/v1/boss/false-knight"
    }
  ]
}`}
      />

      <Endpoint
        method="GET"
        path="/api/v1/boss/{slug}"
        description="Full payload for a single boss."
        example={`{
  "slug": "false-knight",
  "name": "False Knight",
  "game": "hk",
  "hp": { "base": 300 },
  "geo": 200,
  "area": { "slug": "forgotten-crossroads", "name": "Forgotten Crossroads" },
  "phases": [{ "name": "Armoured rampage" }, { "name": "Exposed maggot" }],
  "summary": "..."
}`}
      />

      <Endpoint
        method="GET"
        path="/api/v1/character"
        description="Paginated list of characters — NPCs, merchants, Hunter's Journal enemies, and dream warriors."
        params={[
          { name: "game", type: "hk | silksong", desc: "Filter by game." },
          {
            name: "kind",
            type: "npc | merchant | enemy | warrior",
            desc: "Filter by character kind.",
          },
          {
            name: "area",
            type: "slug",
            desc: "Filter by the slug of the character's primary area.",
          },
          { name: "search", type: "string", desc: "Substring match on name, slug, role, or area." },
          { name: "limit", type: "number", desc: "1–100, default 20." },
          { name: "offset", type: "number", desc: "Default 0." },
        ]}
        example={`{
  "count": 28,
  "next": null,
  "previous": null,
  "results": [
    {
      "slug": "cornifer",
      "name": "Cornifer",
      "game": "hk",
      "kind": "npc",
      "role": "Cartographer",
      "area": { "slug": "forgotten-crossroads", "name": "Forgotten Crossroads" },
      "url": "https://hallownestapi.dev/api/v1/character/cornifer"
    }
  ]
}`}
      />

      <Endpoint
        method="GET"
        path="/api/v1/character/{slug}"
        description="Full payload for a single character. Enemy entries include HP, damage, geo drop, and Hunter's Journal notes."
        example={`{
  "slug": "crawlid",
  "name": "Crawlid",
  "game": "hk",
  "kind": "enemy",
  "role": "Tiny crawling bug",
  "area": { "slug": "forgotten-crossroads", "name": "Forgotten Crossroads" },
  "hp": 5,
  "damage": 1,
  "geoDrop": 1,
  "hunterJournal": {
    "notes": "Mindless creature that crawls along the ground..."
  },
  "summary": "..."
}`}
      />

      <Endpoint
        method="GET"
        path="/api/v1/area"
        description="Paginated list of regions and sub-areas across Hallownest and Pharloom."
        params={[
          { name: "game", type: "hk | silksong", desc: "Filter by game." },
          { name: "kind", type: "region | subarea", desc: "Filter by area kind." },
          { name: "parent", type: "slug", desc: "Slug of the parent region; useful to enumerate sub-areas." },
          { name: "search", type: "string", desc: "Substring match on name, slug, or parent." },
          { name: "limit", type: "number", desc: "1–100, default 20." },
          { name: "offset", type: "number", desc: "Default 0." },
        ]}
        example={`{
  "count": 53,
  "next": null,
  "previous": null,
  "results": [
    {
      "slug": "greenpath",
      "name": "Greenpath",
      "game": "hk",
      "kind": "region",
      "url": "https://hallownestapi.dev/api/v1/area/greenpath"
    }
  ]
}`}
      />

      <Endpoint
        method="GET"
        path="/api/v1/area/{slug}"
        description="Full payload for a single area. The response inlines a sub-areas list under `subareas`."
        example={`{
  "slug": "greenpath",
  "name": "Greenpath",
  "kind": "region",
  "connectsTo": ["forgotten-crossroads", "fog-canyon", "queens-gardens"],
  "stagStation": "Greenpath Stag",
  "subareas": [
    { "slug": "lake-of-unn", "name": "Lake of Unn", "kind": "subarea" }
  ],
  "summary": "..."
}`}
      />

      <Endpoint
        method="GET"
        path="/api/v1/charm"
        description="Paginated list of charms — including the Fragile/Unbreakable line and Kingsoul/Void Heart."
        params={[
          { name: "game", type: "hk | silksong", desc: "Filter by game." },
          { name: "notchCost", type: "0 | 1 | 2 | 3 | 4 | 5", desc: "Filter by notch cost. Void Heart is 0, Kingsoul is 5." },
          { name: "area", type: "slug", desc: "Filter by the primary area of acquisition." },
          { name: "merchant", type: "slug", desc: "Filter by the selling merchant's slug (e.g. salubra)." },
          { name: "search", type: "string", desc: "Substring match on name, slug, or effect tagline." },
          { name: "limit", type: "number", desc: "1–100, default 20." },
          { name: "offset", type: "number", desc: "Default 0." },
        ]}
        example={`{
  "count": 45,
  "next": null,
  "previous": null,
  "results": [
    {
      "slug": "wayward-compass",
      "name": "Wayward Compass",
      "game": "hk",
      "notchCost": 1,
      "effect": "Reveals the Knight's location on the map.",
      "area": { "slug": "dirtmouth", "name": "Dirtmouth" },
      "url": "https://hallownestapi.dev/api/v1/charm/wayward-compass"
    }
  ]
}`}
      />

      <Endpoint
        method="GET"
        path="/api/v1/charm/{slug}"
        description="Full payload for a single charm — notch cost, effect, location, merchant, synergies, and upgrade chain."
        example={`{
  "slug": "fragile-strength",
  "name": "Fragile Strength",
  "notchCost": 3,
  "fragile": true,
  "effect": "Increases nail damage by 50%. Breaks on death.",
  "cost": 600,
  "merchant": "leg-eater",
  "upgradesTo": "unbreakable-strength",
  "synergies": ["quick-slash", "mark-of-pride"]
}`}
      />

      <Endpoint
        method="GET"
        path="/api/v1/skill"
        description="Paginated list of skills — movement abilities, spells, nail arts, and dream tools."
        params={[
          { name: "game", type: "hk | silksong", desc: "Filter by game." },
          { name: "kind", type: "movement | spell | nail-art | dream", desc: "Filter by skill kind." },
          { name: "search", type: "string", desc: "Substring match on name, slug, or effect." },
          { name: "limit", type: "number", desc: "1–100, default 20." },
          { name: "offset", type: "number", desc: "Default 0." },
        ]}
        example={`{
  "count": 18,
  "next": null,
  "previous": null,
  "results": [
    {
      "slug": "vengeful-spirit",
      "name": "Vengeful Spirit",
      "game": "hk",
      "kind": "spell",
      "url": "https://hallownestapi.dev/api/v1/skill/vengeful-spirit"
    }
  ]
}`}
      />

      <Endpoint
        method="GET"
        path="/api/v1/skill/{slug}"
        description="Full payload for a single skill. Spells expose `soulCost` and `damage`."
        example={`{
  "slug": "shade-soul",
  "name": "Shade Soul",
  "kind": "spell",
  "soulCost": 33,
  "damage": 30,
  "upgradeOf": "vengeful-spirit",
  "area": { "slug": "city-of-tears", "name": "City of Tears" }
}`}
        />
      </DocsPage>
    </>
  );
}

function Endpoint({
  method,
  path,
  description,
  params,
  example,
}: {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  params?: { name: string; type: string; desc: string }[];
  example: string;
}) {
  return (
    <section className="space-y-3 rounded-lg border border-border/60 bg-card/40 p-5">
      <header className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="font-mono text-xs">
          {method}
        </Badge>
        <code className="font-mono text-sm">{path}</code>
      </header>
      <p className="text-sm text-muted-foreground">{description}</p>

      {params?.length ? (
        <div className="rounded-md border border-border/60">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Param</th>
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {params.map((p) => (
                <tr key={p.name} className="border-t border-border/60">
                  <td className="px-3 py-2 font-mono text-xs">{p.name}</td>
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{p.type}</td>
                  <td className="px-3 py-2 text-muted-foreground">{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <CodeBlock title="Example response" language="json" code={example} />
    </section>
  );
}
