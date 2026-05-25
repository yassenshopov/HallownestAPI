import { NextResponse } from "next/server";
import { z } from "zod";

import { listAreas, paginateUrls } from "@/lib/data";
import { AreaKindSchema, GameSchema, slug as slugSchema } from "@/lib/schema";

const QuerySchema = z.object({
  game: GameSchema.optional(),
  kind: AreaKindSchema.optional(),
  parent: slugSchema.optional(),
  search: z.string().min(1).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_query", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { game, kind, parent, search, limit, offset } = parsed.data;
  const { total, results } = listAreas({
    game,
    kind,
    parent,
    search,
    limit,
    offset,
  });
  const { next, previous } = paginateUrls({
    baseUrl: `${url.protocol}//${url.host}/api/v1/area`,
    total,
    limit,
    offset,
    extraParams: { game, kind, parent, search },
  });

  return NextResponse.json(
    {
      count: total,
      next,
      previous,
      results: results.map((a) => ({
        slug: a.slug,
        name: a.name,
        game: a.game,
        kind: a.kind,
        parent: a.parent,
        url: `${url.protocol}//${url.host}/api/v1/area/${a.slug}`,
      })),
    },
    {
      headers: {
        "cache-control":
          "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
