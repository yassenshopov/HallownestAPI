import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "stone-sanctuary",
  name: "Stone Sanctuary",
  game: "hk",
  kind: "subarea",
  parent: "greenpath",
  connectsTo: ["greenpath"],
  summary:
    "A dream-veiled grotto in Greenpath where the dream warrior No Eyes is fought.",
  verified: false,
  wikiSlug: "Stone_Sanctuary",
  sources: ["https://hollowknight.fandom.com/wiki/Stone_Sanctuary"],
});

export default data;
