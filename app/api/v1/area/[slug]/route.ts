import { NextResponse } from "next/server";

import { areas } from "@/data/areas";
import { getArea, subareasOf } from "@/lib/data";

export const dynamic = "force-static";

export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) {
    return NextResponse.json(
      { error: "not_found", message: `No area with slug "${slug}"` },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      ...area,
      // Expand sub-areas inline so callers don't have to make a second request
      // to enumerate children of a region.
      subareas: subareasOf(area.slug).map((s) => ({
        slug: s.slug,
        name: s.name,
        kind: s.kind,
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
