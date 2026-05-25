import { bosses, bossBySlug } from "@/data/bosses";
import type { Boss, Game, Paginated } from "@/lib/schema";

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

  let rows = bosses;
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
  return bossBySlug.get(slug);
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
