import { notFound } from "next/navigation";

import { charms, getCharm } from "@/lib/data";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderEntityOg,
} from "@/lib/og-template";
import { GAMES } from "@/lib/schema";

export const alt = "HallownestAPI charm card";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return charms.map((c) => ({ slug: c.slug }));
}

export default async function CharmOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const charm = getCharm(slug);
  if (!charm) notFound();

  const stats = [
    { label: "Game", value: GAMES[charm.game].name },
    {
      label: charm.notchCost === 1 ? "Notch" : "Notches",
      value: String(charm.notchCost),
    },
    ...(charm.area ? [{ label: "Area", value: charm.area.name }] : []),
    ...(typeof charm.cost === "number"
      ? [{ label: "Geo", value: charm.cost.toLocaleString() }]
      : []),
  ];

  return renderEntityOg({
    eyebrow: `Charm · ${GAMES[charm.game].name}`,
    title: charm.name,
    subtitle: charm.effect,
    stats,
  });
}
