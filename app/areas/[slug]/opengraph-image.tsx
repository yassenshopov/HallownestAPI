import { notFound } from "next/navigation";

import { areas, getArea, subareasOf } from "@/lib/data";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderEntityOg,
} from "@/lib/og-template";
import { AREA_KINDS, GAMES } from "@/lib/schema";

export const alt = "HallownestAPI area card";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}

export default async function AreaOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();

  const children = subareasOf(area.slug);
  const stats = [
    { label: "Game", value: GAMES[area.game].name },
    { label: "Kind", value: AREA_KINDS[area.kind].name },
    ...(children.length > 0
      ? [
          {
            label: children.length === 1 ? "Sub-area" : "Sub-areas",
            value: String(children.length),
          },
        ]
      : []),
    ...(area.stagStation ? [{ label: "Stag", value: area.stagStation }] : []),
  ];

  return renderEntityOg({
    eyebrow: `${AREA_KINDS[area.kind].name} · ${GAMES[area.game].name}`,
    title: area.name,
    subtitle: area.summary,
    stats,
  });
}
