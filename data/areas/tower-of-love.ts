import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "tower-of-love",
  name: "Tower of Love",
  game: "hk",
  kind: "subarea",
  parent: "city-of-tears",
  connectsTo: ["city-of-tears"],
  summary:
    "A locked tower in the City of Tears, opened by the Love Key. Inside, the Collector hoards captured grubs in jars.",
  verified: false,
  wikiSlug: "Tower_of_Love",
  sources: ["https://hollowknight.fandom.com/wiki/Tower_of_Love"],
});

export default data;
