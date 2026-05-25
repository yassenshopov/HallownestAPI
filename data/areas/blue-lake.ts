import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "blue-lake",
  name: "Blue Lake",
  game: "hk",
  kind: "subarea",
  parent: "resting-grounds",
  connectsTo: ["resting-grounds", "ancient-basin"],
  summary:
    "A still aquamarine reservoir above the Ancient Basin. Source of the rain that drenches the City of Tears.",
  verified: false,
  wikiSlug: "Blue_Lake",
  sources: ["https://hollowknight.fandom.com/wiki/Blue_Lake"],
});

export default data;
