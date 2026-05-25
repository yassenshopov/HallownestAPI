# HallownestAPI

> An open, structured data API for Hollow Knight and Silksong. Free, fan-made, non-commercial. Inspired by [PokeAPI](https://pokeapi.co).

This repo is both the API and its docs site, built with Next.js 16. Every entity lives as a TypeScript file in `data/`, is Zod-validated at build time, and is served as static JSON at the edge.

## Stack

- **Next.js 16** (App Router, Turbopack, React 19)
- **TypeScript** + **Zod** for end-to-end schema validation
- **Tailwind v4** + **shadcn/ui** (`new-york` style, dark by default)
- **next-themes** for dark/light toggle
- **Clerk** (optional — auth only activates when env vars are present)
- **Supabase** (reserved for v3 — user accounts, saved builds)
- **lucide-react** icons

## Quickstart

```bash
npm install
cp .env.example .env.local   # optional — defaults work without any env vars
npm run dev
```

Open [http://localhost:112](http://localhost:112).

Try the API:

```bash
curl http://localhost:112/api/v1
curl "http://localhost:112/api/v1/boss?game=hk"
curl http://localhost:112/api/v1/boss/false-knight
```

## Project layout

```
app/
  api/v1/                    REST endpoints (route handlers)
  bosses/                    Browse + detail pages
  docs/                      Docs site (sidebar + MDX-free content)
  layout.tsx                 Root layout (theme, auth, fonts)
  page.tsx                   Landing page
components/
  ui/                        shadcn/ui primitives (owned source)
  theme-provider.tsx         next-themes wrapper
  theme-toggle.tsx           Sun/moon button
  site-header.tsx            Sticky nav
  site-footer.tsx            Footer + legal note
  hollow-mark.tsx            HK-inspired SVG mark (original art)
  code-block.tsx             Copy-to-clipboard code block
  docs-shell.tsx             DocsPage / DocsSection
  auth-provider.tsx          Clerk, opt-in via env
data/
  areas/                     One file per area / sub-area (Region or Subarea)
  bosses/                    One file per boss; default-exports a validated Boss
  characters/                NPCs, merchants, dream warriors, Hunter's Journal enemies
  charms/                    All 45 charm slots (Fragile/Unbreakable as separate entries)
  skills/                    Spells, nail arts, dream tools, movement abilities
lib/
  schema.ts                  Zod schemas
  data.ts                    In-memory query helpers (filter/paginate)
  utils.ts                   shadcn `cn()`
```

## Adding a boss

```ts
// data/bosses/marmu.ts
import { BossSchema, type Boss } from "@/lib/schema";

const data: Boss = BossSchema.parse({
  slug: "marmu",
  name: "Marmu",
  game: "hk",
  optional: true,
  hp: { base: 250 },
  area: { slug: "queens-gardens", name: "Queen's Gardens" },
  summary: "A dream warrior fought in Queen's Gardens via her dreaming grave.",
  verified: false,
});

export default data;
```

Then register it in `data/bosses/index.ts`. The dev server hot-reloads. The build refuses anything that doesn't parse.

## Wiki image cache

Every boss with a `wikiSlug` gets enriched at build time with an image URL
and a canonical wiki page URL pulled from the Fandom MediaWiki API. The
script is at `scripts/fetch-wiki.mjs` and the result is committed to
`data/wiki-cache.json` so builds stay deterministic and offline-safe.

```bash
node scripts/fetch-wiki.mjs
```

Images are served from the upstream wiki CDN (`static.wikia.nocookie.net`)
and are credited per-entry under their original CC BY-SA 3.0 license.
HallownestAPI does not host these images.

## Coverage

- **46 bosses** indexed, covering the full Hollow Knight roster
  (base game, Dream Warriors / Variants, Hidden Dreams, Grimm Troupe, Lifeblood,
  Godmaster Pantheons).
- **90 characters** — NPCs, merchants, dream warriors, and Hunter's Journal
  enemies (Dreamers, Nailmasters, Grimm Troupe, City of Tears sentries,
  Crystal Peak miners, and friends). New entries are easy PRs.
- **53 areas** — every Hollow Knight region plus their named sub-areas
  (Ancestral Mound, Soul Sanctum, Mantis Village, Path of Pain, Pantheons, …)
  with a connection graph between them.
- **45 charm slots** — including the Fragile/Unbreakable upgrade pairs and
  Kingsoul/Void Heart, with notch cost, merchant, synergies, and where to
  find them.
- **18 skills** — spells, nail arts, dream tools, and movement abilities,
  including their upgraded forms.
- Silksong coverage is held back until release-week dust settles. Reserved
  in the schema (`game: "silksong"`).

## Roadmap

- **v0** (now): bosses, characters, areas, charms, skills — REST list + detail, docs.
- **v1**: complete the synergy and connection graphs, Silksong coverage,
  OpenAPI spec, generated SDKs.
- **v2**: items, relics, pantheons, mask shards + vessel fragments, GraphQL.
- **v3**: user accounts (Supabase + Clerk), saved builds, community PR pipeline.

## Legal

Hollow Knight and Silksong are trademarks of [Team Cherry](https://www.teamcherry.com.au/). HallownestAPI is unaffiliated. We host facts (HP, slugs, area names) and link out to wikis for art and lore. See `[/docs/legal](http://localhost:112/docs/legal)`.

## License

Code: MIT. Data: CC BY-NC-SA 4.0 (attribute, non-commercial, share-alike).