import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "royal-waterways",
  name: "Royal Waterways",
  game: "hk",
  kind: "region",
  connectsTo: [
    "city-of-tears",
    "ancient-basin",
    "kingdoms-edge",
    "junk-pit",
    "ismas-grove",
  ],
  music: "Royal Waterways",
  summary:
    "The flooded sewers beneath the City of Tears. Houses the Dung Defender, Flukemarm, Isma's Tear, and the Junk Pit's hidden Godseekers.",
  verified: false,
  wikiSlug: "Royal_Waterways",
  sources: ["https://hollowknight.fandom.com/wiki/Royal_Waterways"],
});

export default data;
