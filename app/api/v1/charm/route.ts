import { NextResponse } from "next/server";
import { z } from "zod";

import { listCharms, paginateUrls } from "@/lib/data";
import { GameSchema, slug as slugSchema } from "@/lib/schema";

const QuerySchema = z.object({
  game: GameSchema.optional(),
  notchCost: z.coerce.number().int().min(0).max(5).optional(),
  area: slugSchema.optional(),
  merchant: slugSchema.optional(),
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

  const { game, notchCost, area, merchant, search, limit, offset } =
    parsed.data;
  const { total, results } = listCharms({
    game,
    notchCost,
    area,
    merchant,
    search,
    limit,
    offset,
  });
  const { next, previous } = paginateUrls({
    baseUrl: `${url.protocol}//${url.host}/api/v1/charm`,
    total,
    limit,
    offset,
    extraParams: {
      game,
      notchCost: typeof notchCost === "number" ? String(notchCost) : undefined,
      area,
      merchant,
      search,
    },
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
        notchCost: c.notchCost,
        effect: c.effect,
        area: c.area,
        url: `${url.protocol}//${url.host}/api/v1/charm/${c.slug}`,
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
