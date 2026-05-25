import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "kings-station",
  name: "King's Station",
  game: "hk",
  kind: "subarea",
  parent: "city-of-tears",
  connectsTo: ["city-of-tears", "royal-waterways"],
  stagStation: "King's Station",
  summary:
    "The largest Stag terminus in Hallownest. Sits on the eastern edge of the City of Tears and connects down to the Royal Waterways.",
  verified: false,
  wikiSlug: "King%27s_Station",
  sources: ["https://hollowknight.fandom.com/wiki/King%27s_Station"],
});

export default data;
