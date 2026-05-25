import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "the-abyss",
  name: "The Abyss",
  game: "hk",
  kind: "region",
  connectsTo: ["ancient-basin", "birthplace", "lifeblood-core-chamber"],
  music: "The Abyss",
  summary:
    "The void-filled void at the bottom of Hallownest. Birthplace of the Vessels and source of the Shade Cloak, Abyss Shriek, and Void Heart.",
  verified: false,
  wikiSlug: "Abyss",
  sources: ["https://hollowknight.fandom.com/wiki/Abyss"],
});

export default data;
