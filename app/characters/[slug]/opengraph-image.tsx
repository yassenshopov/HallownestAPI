import { notFound } from "next/navigation";

import { characters, getCharacter } from "@/lib/data";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderEntityOg,
} from "@/lib/og-template";
import { CHARACTER_KINDS, GAMES } from "@/lib/schema";

export const alt = "HallownestAPI character card";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return characters.map((c) => ({ slug: c.slug }));
}

export default async function CharacterOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const character = getCharacter(slug);
  if (!character) notFound();

  const stats = [
    { label: "Game", value: GAMES[character.game].name },
    { label: "Kind", value: CHARACTER_KINDS[character.kind].name },
    ...(character.area ? [{ label: "Area", value: character.area.name }] : []),
    ...(character.kind === "enemy" && typeof character.hp === "number"
      ? [{ label: "HP", value: String(character.hp) }]
      : []),
  ];

  return renderEntityOg({
    eyebrow: `${CHARACTER_KINDS[character.kind].name} · ${GAMES[character.game].name}`,
    title: character.name,
    subtitle: character.summary,
    stats,
  });
}
