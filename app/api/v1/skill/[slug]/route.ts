import { NextResponse } from "next/server";

import { skills } from "@/data/skills";
import { getSkill } from "@/lib/data";

export const dynamic = "force-static";

export function generateStaticParams() {
  return skills.map((s) => ({ slug: s.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) {
    return NextResponse.json(
      { error: "not_found", message: `No skill with slug "${slug}"` },
      { status: 404 },
    );
  }

  return NextResponse.json(skill, {
    headers: {
      "cache-control":
        "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
