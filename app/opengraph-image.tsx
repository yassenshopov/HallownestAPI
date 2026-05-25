import { bossBySlug } from "@/data/bosses";
import { characterBySlug } from "@/data/characters";
import { areaBySlug } from "@/data/areas";
import { charmBySlug } from "@/data/charms";
import { skillBySlug } from "@/data/skills";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderEntityOg,
} from "@/lib/og-template";

export const alt =
  "HallownestAPI — an open REST API for Hollow Knight & Silksong";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OgImage() {
  // Pulls counts off the actual registry at build time so the social card
  // never lies about what's indexed.
  const stats = [
    { label: "Bosses", value: String(bossBySlug.size) },
    { label: "Charms", value: String(charmBySlug.size) },
    { label: "Areas", value: String(areaBySlug.size) },
    { label: "Skills", value: String(skillBySlug.size) },
    { label: "Characters", value: String(characterBySlug.size) },
  ];

  return renderEntityOg({
    eyebrow: "Hollow Knight · Silksong",
    title: "HallownestAPI",
    subtitle: "An open, structured REST API for Hollow Knight & Silksong data.",
    stats,
  });
}
