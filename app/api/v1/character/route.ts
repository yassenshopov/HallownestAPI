import { NextResponse } from "next/server";
import { z } from "zod";

import { listCharacters, paginateUrls } from "@/lib/data";
import { CharacterKindSchema, GameSchema, slug as slugSchema } from "@/lib/schema";

const QuerySchema = z.object({
  game: GameSchema.optional(),
  kind: CharacterKindSchema.optional(),
  area: slugSchema.optional(),
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

  const { game, kind, area, search, limit, offset } = parsed.data;
  const { total, results } = listCharacters({
    game,
    kind,
    area,
    search,
    limit,
    offset,
  });
  const { next, previous } = paginateUrls({
    baseUrl: `${url.protocol}//${url.host}/api/v1/character`,
    total,
    limit,
    offset,
    extraParams: { game, kind, area, search },
  });

  return NextResponse.json(
    {
      count: total,
      next,
      previous,
      results: results.map((c) => ({
        slug: c.slug,
        name: c.name,
        game: c.game,
        kind: c.kind,
        role: c.role,
        area: c.area,
        url: `${url.protocol}//${url.host}/api/v1/character/${c.slug}`,
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
