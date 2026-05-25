import { NextResponse } from "next/server";

export const dynamic = "force-static";

export function GET(request: Request) {
  const base = new URL(request.url);
  const root = `${base.protocol}//${base.host}/api/v1`;
  return NextResponse.json(
    {
      name: "HallownestAPI",
      version: "v1",
      description:
        "Open, structured data API for Hollow Knight and Silksong. Fan-made, non-commercial.",
      docs: `${base.protocol}//${base.host}/docs`,
      endpoints: {
        bosses: `${root}/boss`,
        boss: `${root}/boss/{slug}`,
      },
    },
    {
      headers: {
        "cache-control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
