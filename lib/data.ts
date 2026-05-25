import { bosses as rawBosses, bossBySlug as rawBossBySlug } from "@/data/bosses";
import wikiCacheJson from "@/data/wiki-cache.json";
import type { Boss, BossImage, Game, Paginated } from "@/lib/schema";

type WikiCacheEntry = {
  wikiSlug?: string;
  wikiUrl?: string;
  image?: BossImage;
};

const wikiCache = wikiCacheJson as Record<string, WikiCacheEntry>;

function withWiki(boss: Boss): Boss {
  const entry = wikiCache[boss.slug];
  if (!entry) return boss;
  return {
    ...boss,
    wikiUrl: boss.wikiUrl ?? entry.wikiUrl,
    image: boss.image ?? entry.image,
  };
}

const enrichedBosses: Boss[] = rawBosses.map(withWiki);
const enrichedBySlug = new Map(enrichedBosses.map((b) => [b.slug, b]));

export const bosses = enrichedBosses;
export const bossBySlug = enrichedBySlug;
// Re-export raw map under a separate name in case callers want unmerged data.
export const rawBossLookup = rawBossBySlug;

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
  return enrichedBySlug.get(slug);
}

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
