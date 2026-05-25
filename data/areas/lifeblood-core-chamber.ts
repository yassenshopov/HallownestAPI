import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "lifeblood-core-chamber",
  name: "Lifeblood Core Chamber",
  game: "hk",
  kind: "subarea",
  parent: "the-abyss",
  connectsTo: ["the-abyss"],
  summary:
    "A hidden alcove in the Abyss housing the Lifeblood Core charm — guarded by lengthy parkour through ink-black darkness.",
  verified: false,
  wikiSlug: "Lifeblood_Core",
  sources: ["https://hollowknight.fandom.com/wiki/Lifeblood_Core"],
});

export default data;
