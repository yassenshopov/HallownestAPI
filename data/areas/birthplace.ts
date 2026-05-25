import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "birthplace",
  name: "Birthplace",
  game: "hk",
  kind: "subarea",
  parent: "the-abyss",
  connectsTo: ["the-abyss"],
  summary:
    "A hidden chamber at the very bottom of the Abyss. Holds the Void Heart and reveals the origin of the Vessels.",
  verified: false,
  wikiSlug: "Birthplace",
  sources: ["https://hollowknight.fandom.com/wiki/Birthplace"],
});

export default data;
