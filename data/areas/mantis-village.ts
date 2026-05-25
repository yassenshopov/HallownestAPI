import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "mantis-village",
  name: "Mantis Village",
  game: "hk",
  kind: "subarea",
  parent: "fungal-wastes",
  connectsTo: ["fungal-wastes", "deepnest"],
  summary:
    "Stronghold of the Mantis tribe in the depths of the Fungal Wastes. Houses the throne fight against the Mantis Lords.",
  verified: false,
  wikiSlug: "Mantis_Village",
  sources: ["https://hollowknight.fandom.com/wiki/Mantis_Village"],
});

export default data;
