import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "ancestral-mound",
  name: "Ancestral Mound",
  game: "hk",
  kind: "subarea",
  parent: "forgotten-crossroads",
  connectsTo: ["forgotten-crossroads"],
  summary:
    "A quiet shrine tucked off the Crossroads where the Snail Shaman teaches the Knight Vengeful Spirit.",
  verified: false,
  wikiSlug: "Ancestral_Mound",
  sources: ["https://hollowknight.fandom.com/wiki/Ancestral_Mound"],
});

export default data;
