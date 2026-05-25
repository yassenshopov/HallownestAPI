import { notFound } from "next/navigation";

import { getSkill, skills } from "@/lib/data";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderEntityOg,
} from "@/lib/og-template";
import { GAMES, SKILL_KINDS } from "@/lib/schema";

export const alt = "HallownestAPI skill card";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return skills.map((s) => ({ slug: s.slug }));
}

export default async function SkillOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) notFound();

  const stats = [
    { label: "Game", value: GAMES[skill.game].name },
    { label: "Kind", value: SKILL_KINDS[skill.kind].name },
    ...(typeof skill.soulCost === "number"
      ? [{ label: "SOUL", value: String(skill.soulCost) }]
      : []),
    ...(typeof skill.damage === "number"
      ? [{ label: "Dmg", value: String(skill.damage) }]
      : []),
  ];

  return renderEntityOg({
    eyebrow: `Skill · ${GAMES[skill.game].name}`,
    title: skill.name,
    subtitle: skill.effect ?? skill.summary,
    stats,
  });
}
