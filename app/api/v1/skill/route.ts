import { NextResponse } from "next/server";
import { z } from "zod";

import { listSkills, paginateUrls } from "@/lib/data";
import { GameSchema, SkillKindSchema } from "@/lib/schema";

const QuerySchema = z.object({
  game: GameSchema.optional(),
  kind: SkillKindSchema.optional(),
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

  const { game, kind, search, limit, offset } = parsed.data;
  const { total, results } = listSkills({ game, kind, search, limit, offset });
  const { next, previous } = paginateUrls({
    baseUrl: `${url.protocol}//${url.host}/api/v1/skill`,
    total,
    limit,
    offset,
    extraParams: { game, kind, search },
  });

  return NextResponse.json(
    {
      count: total,
      next,
      previous,
      results: results.map((s) => ({
        slug: s.slug,
        name: s.name,
        game: s.game,
        kind: s.kind,
        url: `${url.protocol}//${url.host}/api/v1/skill/${s.slug}`,
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
