import { NextResponse } from "next/server";

import { charms } from "@/data/charms";
import { getCharm } from "@/lib/data";

export const dynamic = "force-static";

export function generateStaticParams() {
  return charms.map((c) => ({ slug: c.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const charm = getCharm(slug);
  if (!charm) {
    return NextResponse.json(
      { error: "not_found", message: `No charm with slug "${slug}"` },
      { status: 404 },
    );
  }

  return NextResponse.json(charm, {
    headers: {
      "cache-control":
        "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
