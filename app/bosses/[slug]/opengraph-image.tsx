import { notFound } from "next/navigation";

import { bosses, getBoss } from "@/lib/data";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderEntityOg,
} from "@/lib/og-template";
import { GAMES } from "@/lib/schema";

export const alt = "HallownestAPI boss card";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return bosses.map((b) => ({ slug: b.slug }));
}

export default async function BossOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const boss = getBoss(slug);
  if (!boss) notFound();

  const hp = boss.hp?.base ?? boss.hp?.attuned ?? boss.hp?.ascended;
  const stats = [
    { label: "Game", value: GAMES[boss.game].name },
    { label: "Area", value: boss.area.name },
    ...(hp ? [{ label: "HP", value: String(hp) }] : []),
    ...(typeof boss.geo === "number"
      ? [{ label: "Geo", value: String(boss.geo) }]
      : []),
  ];

  return renderEntityOg({
    eyebrow: `Boss · ${GAMES[boss.game].name}`,
    title: boss.name,
    subtitle: boss.summary,
    stats,
  });
}
