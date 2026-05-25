import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "ancient-basin",
  name: "Ancient Basin",
  game: "hk",
  kind: "region",
  connectsTo: [
    "forgotten-crossroads",
    "royal-waterways",
    "kingdoms-edge",
    "city-of-tears",
    "blue-lake",
    "palace-grounds",
    "hidden-station",
    "the-abyss",
  ],
  stagStation: "Hidden Station",
  music: "Ancient Basin",
  summary:
    "A vast hollow chasm beneath the City of Tears. Site of the Broken Vessel fight and the gateway to the Abyss.",
  verified: false,
  wikiSlug: "Ancient_Basin",
  sources: ["https://hollowknight.fandom.com/wiki/Ancient_Basin"],
});

export default data;
