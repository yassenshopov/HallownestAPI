import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "kings-pass",
  name: "King's Pass",
  game: "hk",
  kind: "subarea",
  parent: "dirtmouth",
  connectsTo: ["dirtmouth"],
  summary:
    "The cavernous tutorial passage from the rim of the pit down to Dirtmouth. The Knight's entry into Hallownest proper.",
  verified: false,
  wikiSlug: "King%27s_Pass",
  sources: ["https://hollowknight.fandom.com/wiki/King%27s_Pass"],
});

export default data;
