import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "overgrown-mound",
  name: "Overgrown Mound",
  game: "hk",
  kind: "subarea",
  parent: "fog-canyon",
  connectsTo: ["fog-canyon"],
  summary:
    "An old shrine in Fog Canyon where Cornifer abandons his maps and Massive Moss Charger's larger cousins prowl.",
  verified: false,
  wikiSlug: "Overgrown_Mound",
  sources: ["https://hollowknight.fandom.com/wiki/Overgrown_Mound"],
});

export default data;
