import { NextResponse } from "next/server";

import { bosses } from "@/data/bosses";
import { getBoss } from "@/lib/data";

export const dynamic = "force-static";

export function generateStaticParams() {
  return bosses.map((b) => ({ slug: b.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const boss = getBoss(slug);
  if (!boss) {
    return NextResponse.json(
      { error: "not_found", message: `No boss with slug "${slug}"` },
      { status: 404 },
    );
  }

  return NextResponse.json(boss, {
    headers: {
      "cache-control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
