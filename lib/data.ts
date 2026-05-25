import { areas as rawAreas, areaBySlug as rawAreaBySlug } from "@/data/areas";
import { bosses as rawBosses, bossBySlug as rawBossBySlug } from "@/data/bosses";
import { charms as rawCharms, charmBySlug as rawCharmBySlug } from "@/data/charms";
import {
  characters as rawCharacters,
  characterBySlug as rawCharacterBySlug,
} from "@/data/characters";
import { skills as rawSkills, skillBySlug as rawSkillBySlug } from "@/data/skills";
import wikiCacheJson from "@/data/wiki-cache.json";
import type {
  Area,
  AreaKind,
  Boss,
  Character,
  CharacterKind,
  Charm,
  Game,
  Paginated,
  Skill,
  SkillKind,
} from "@/lib/schema";

type WikiCacheEntry = {
  wikiSlug?: string;
  wikiUrl?: string;
};

/**
 * The wiki cache started out as a flat `slug → entry` map (bosses only).
 * As more entity types arrive, the fetch script writes a namespaced shape
 * (`{ bosses: { ... }, characters: { ... }, ... }`). We tolerate both here
 * so an out-of-date `wiki-cache.json` keeps boss lookups working.
 */
type FlatWikiCache = Record<string, WikiCacheEntry>;
type WikiNamespace = "bosses" | "characters" | "areas" | "charms" | "skills";
type NamespacedWikiCache = Partial<Record<WikiNamespace, FlatWikiCache>>;
type WikiCache = FlatWikiCache | NamespacedWikiCache;

const wikiCache = wikiCacheJson as WikiCache;

function readNamespace(ns: WikiNamespace): FlatWikiCache {
  if (
    wikiCache &&
    typeof wikiCache === "object" &&
    Object.hasOwn(wikiCache as object, ns) &&
    typeof (wikiCache as Record<string, unknown>)[ns] === "object"
  ) {
    return ((wikiCache as NamespacedWikiCache)[ns] ?? {}) as FlatWikiCache;
  }
  // Legacy flat-shape cache only ever held bosses.
  if (ns === "bosses") return wikiCache as FlatWikiCache;
  return {};
}

const bossWiki = readNamespace("bosses");
const characterWiki = readNamespace("characters");
const areaWiki = readNamespace("areas");
const charmWiki = readNamespace("charms");
const skillWiki = readNamespace("skills");

/**
 * Generic merge: copy the wiki-cached fields onto an entity if they are not
 * already set in source. Used by every entity type — they all carry the same
 * `wikiSlug`/`wikiUrl` pair pointing at the Fandom wiki article.
 */
function withWiki<
  T extends {
    slug: string;
    wikiSlug?: string;
    wikiUrl?: string;
  },
>(entry: T, cache: FlatWikiCache): T {
  const hit = cache[entry.slug];
  if (!hit) return entry;
  return {
    ...entry,
    wikiSlug: entry.wikiSlug ?? hit.wikiSlug,
    wikiUrl: entry.wikiUrl ?? hit.wikiUrl,
  };
}

const enrichedBosses: Boss[] = rawBosses.map((b) => withWiki(b, bossWiki));
const enrichedBossBySlug = new Map(enrichedBosses.map((b) => [b.slug, b]));

const enrichedCharacters: Character[] = rawCharacters.map((c) =>
  withWiki(c, characterWiki),
);
const enrichedCharacterBySlug = new Map(
  enrichedCharacters.map((c) => [c.slug, c]),
);

const enrichedAreas: Area[] = rawAreas.map((a) => withWiki(a, areaWiki));
const enrichedAreaBySlug = new Map(enrichedAreas.map((a) => [a.slug, a]));

const enrichedCharms: Charm[] = rawCharms.map((c) => withWiki(c, charmWiki));
const enrichedCharmBySlug = new Map(enrichedCharms.map((c) => [c.slug, c]));

const enrichedSkills: Skill[] = rawSkills.map((s) => withWiki(s, skillWiki));
const enrichedSkillBySlug = new Map(enrichedSkills.map((s) => [s.slug, s]));

export const bosses = enrichedBosses;
export const bossBySlug = enrichedBossBySlug;
export const rawBossLookup = rawBossBySlug;

export const characters = enrichedCharacters;
export const characterBySlug = enrichedCharacterBySlug;
export const rawCharacterLookup = rawCharacterBySlug;

export const areas = enrichedAreas;
export const areaBySlug = enrichedAreaBySlug;
export const rawAreaLookup = rawAreaBySlug;

export const charms = enrichedCharms;
export const charmBySlug = enrichedCharmBySlug;
export const rawCharmLookup = rawCharmBySlug;

export const skills = enrichedSkills;
export const skillBySlug = enrichedSkillBySlug;
export const rawSkillLookup = rawSkillBySlug;

// -----------------------------------------------------------------------------
// Bosses
// -----------------------------------------------------------------------------

export type BossListFilters = {
  game?: Game;
  search?: string;
  limit?: number;
  offset?: number;
};

export function listBosses(filters: BossListFilters = {}): {
  total: number;
  results: Boss[];
} {
  const { game, search, limit = 20, offset = 0 } = filters;

  let rows = enrichedBosses;
  if (game) rows = rows.filter((b) => b.game === game);
  if (search) {
    const q = search.trim().toLowerCase();
    rows = rows.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.slug.includes(q) ||
        b.area.name.toLowerCase().includes(q),
    );
  }

  const total = rows.length;
  const paged = rows.slice(offset, offset + limit);
  return { total, results: paged };
}

export function getBoss(slug: string): Boss | undefined {
  return enrichedBossBySlug.get(slug);
}

// -----------------------------------------------------------------------------
// Characters
// -----------------------------------------------------------------------------

export type CharacterListFilters = {
  game?: Game;
  kind?: CharacterKind;
  area?: string;
  search?: string;
  limit?: number;
  offset?: number;
};

export function listCharacters(filters: CharacterListFilters = {}): {
  total: number;
  results: Character[];
} {
  const { game, kind, area, search, limit = 20, offset = 0 } = filters;

  let rows = enrichedCharacters;
  if (game) rows = rows.filter((c) => c.game === game);
  if (kind) rows = rows.filter((c) => c.kind === kind);
  if (area) rows = rows.filter((c) => c.area?.slug === area);
  if (search) {
    const q = search.trim().toLowerCase();
    rows = rows.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.includes(q) ||
        (c.role?.toLowerCase().includes(q) ?? false) ||
        (c.area?.name.toLowerCase().includes(q) ?? false),
    );
  }

  const total = rows.length;
  const paged = rows.slice(offset, offset + limit);
  return { total, results: paged };
}

export function getCharacter(slug: string): Character | undefined {
  return enrichedCharacterBySlug.get(slug);
}

// -----------------------------------------------------------------------------
// Areas
// -----------------------------------------------------------------------------

export type AreaListFilters = {
  game?: Game;
  kind?: AreaKind;
  parent?: string;
  search?: string;
  limit?: number;
  offset?: number;
};

export function listAreas(filters: AreaListFilters = {}): {
  total: number;
  results: Area[];
} {
  const { game, kind, parent, search, limit = 20, offset = 0 } = filters;

  let rows = enrichedAreas;
  if (game) rows = rows.filter((a) => a.game === game);
  if (kind) rows = rows.filter((a) => a.kind === kind);
  if (parent) rows = rows.filter((a) => a.parent === parent);
  if (search) {
    const q = search.trim().toLowerCase();
    rows = rows.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.slug.includes(q) ||
        (a.parent?.includes(q) ?? false),
    );
  }

  const total = rows.length;
  const paged = rows.slice(offset, offset + limit);
  return { total, results: paged };
}

export function getArea(slug: string): Area | undefined {
  return enrichedAreaBySlug.get(slug);
}

/** Children of an area, computed on the fly from the parent field. */
export function subareasOf(parentSlug: string): Area[] {
  return enrichedAreas.filter((a) => a.parent === parentSlug);
}

// -----------------------------------------------------------------------------
// Charms
// -----------------------------------------------------------------------------

export type CharmListFilters = {
  game?: Game;
  notchCost?: number;
  area?: string;
  merchant?: string;
  search?: string;
  limit?: number;
  offset?: number;
};

export function listCharms(filters: CharmListFilters = {}): {
  total: number;
  results: Charm[];
} {
  const { game, notchCost, area, merchant, search, limit = 20, offset = 0 } =
    filters;

  let rows = enrichedCharms;
  if (game) rows = rows.filter((c) => c.game === game);
  if (typeof notchCost === "number")
    rows = rows.filter((c) => c.notchCost === notchCost);
  if (area) rows = rows.filter((c) => c.area?.slug === area);
  if (merchant) rows = rows.filter((c) => c.merchant === merchant);
  if (search) {
    const q = search.trim().toLowerCase();
    rows = rows.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.includes(q) ||
        c.effect.toLowerCase().includes(q),
    );
  }

  const total = rows.length;
  const paged = rows.slice(offset, offset + limit);
  return { total, results: paged };
}

export function getCharm(slug: string): Charm | undefined {
  return enrichedCharmBySlug.get(slug);
}

// -----------------------------------------------------------------------------
// Skills
// -----------------------------------------------------------------------------

export type SkillListFilters = {
  game?: Game;
  kind?: SkillKind;
  search?: string;
  limit?: number;
  offset?: number;
};

export function listSkills(filters: SkillListFilters = {}): {
  total: number;
  results: Skill[];
} {
  const { game, kind, search, limit = 20, offset = 0 } = filters;

  let rows = enrichedSkills;
  if (game) rows = rows.filter((s) => s.game === game);
  if (kind) rows = rows.filter((s) => s.kind === kind);
  if (search) {
    const q = search.trim().toLowerCase();
    rows = rows.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.slug.includes(q) ||
        (s.effect?.toLowerCase().includes(q) ?? false),
    );
  }

  const total = rows.length;
  const paged = rows.slice(offset, offset + limit);
  return { total, results: paged };
}

export function getSkill(slug: string): Skill | undefined {
  return enrichedSkillBySlug.get(slug);
}

// -----------------------------------------------------------------------------
// Shared pagination URL builder
// -----------------------------------------------------------------------------

export function paginateUrls({
  baseUrl,
  total,
  limit,
  offset,
  extraParams,
}: {
  baseUrl: string;
  total: number;
  limit: number;
  offset: number;
  extraParams?: Record<string, string | undefined>;
}): Pick<Paginated<unknown>, "next" | "previous"> {
  const make = (off: number) => {
    const url = new URL(baseUrl);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(off));
    if (extraParams) {
      for (const [k, v] of Object.entries(extraParams)) {
        if (v) url.searchParams.set(k, v);
      }
    }
    return url.toString();
  };

  const next = offset + limit < total ? make(offset + limit) : null;
  const previous = offset > 0 ? make(Math.max(0, offset - limit)) : null;
  return { next, previous };
}
