import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "howling-cliffs",
  name: "Howling Cliffs",
  game: "hk",
  kind: "region",
  connectsTo: ["dirtmouth", "crystal-peak", "stag-nest"],
  music: "Howling Cliffs",
  summary:
    "A windswept ridge on the western edge of the surface. Site of Gorb, Joni's Repose, and Nightmare King Grimm's dream encounter.",
  verified: false,
  wikiSlug: "Howling_Cliffs",
  sources: ["https://hollowknight.fandom.com/wiki/Howling_Cliffs"],
});

export default data;
