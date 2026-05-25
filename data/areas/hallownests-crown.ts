import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "hallownests-crown",
  name: "Hallownest's Crown",
  game: "hk",
  kind: "subarea",
  parent: "crystal-peak",
  connectsTo: ["crystal-peak"],
  summary:
    "The bright, snow-veiled peak above Crystal Peak. Houses a Vessel Fragment and Markoth's dream tablet on the summit.",
  verified: false,
  wikiSlug: "Hallownest%27s_Crown",
  sources: ["https://hollowknight.fandom.com/wiki/Hallownest%27s_Crown"],
});

export default data;
