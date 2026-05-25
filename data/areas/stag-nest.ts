import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "stag-nest",
  name: "Stag Nest",
  game: "hk",
  kind: "subarea",
  parent: "queens-gardens",
  connectsTo: ["queens-gardens", "howling-cliffs"],
  stagStation: "Stag Nest",
  summary:
    "The Stag Beetle ancestral nest, hidden in Howling Cliffs. Reached via a one-way ride or with an unlocked Stag station — home to the Old Stag's family.",
  verified: false,
  wikiSlug: "Stag_Nest",
  sources: ["https://hollowknight.fandom.com/wiki/Stag_Nest"],
});

export default data;
