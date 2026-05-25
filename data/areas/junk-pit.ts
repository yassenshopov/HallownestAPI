import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "junk-pit",
  name: "Junk Pit",
  game: "hk",
  kind: "subarea",
  parent: "royal-waterways",
  connectsTo: ["royal-waterways", "godhome"],
  summary:
    "A filthy refuse heap beneath the Royal Waterways. Home to the Godseekers and the door that drops the Knight into Godhome.",
  verified: false,
  wikiSlug: "Junk_Pit",
  sources: ["https://hollowknight.fandom.com/wiki/Junk_Pit"],
});

export default data;
