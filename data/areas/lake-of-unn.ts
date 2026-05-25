import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "lake-of-unn",
  name: "Lake of Unn",
  game: "hk",
  kind: "subarea",
  parent: "greenpath",
  connectsTo: ["greenpath"],
  summary:
    "A still lake at the heart of Greenpath where the slug-god Unn dwells. Site of the Shape of Unn charm.",
  verified: false,
  wikiSlug: "Lake_of_Unn",
  sources: ["https://hollowknight.fandom.com/wiki/Lake_of_Unn"],
});

export default data;
