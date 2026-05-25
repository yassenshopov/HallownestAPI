import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "hive",
  name: "The Hive",
  game: "hk",
  kind: "subarea",
  parent: "kingdoms-edge",
  connectsTo: ["kingdoms-edge"],
  summary:
    "An amber-lit beehive lodged in Kingdom's Edge. Home to the Hive Knight and the Hiveblood charm.",
  verified: false,
  wikiSlug: "Hive",
  sources: ["https://hollowknight.fandom.com/wiki/Hive"],
});

export default data;
