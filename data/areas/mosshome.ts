import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "mosshome",
  name: "Mosshome",
  game: "silksong",
  kind: "region",
  connectsTo: [],
  summary:
    "An early Silksong region of mossy ruins. Provisional entry — full details land after release week.",
  verified: false,
  wikiSlug: "Mosshome",
  sources: ["https://hollowknight.fandom.com/wiki/Mosshome"],
});

export default data;
