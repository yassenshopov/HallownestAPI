import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "hall-of-gods",
  name: "Hall of Gods",
  game: "hk",
  kind: "subarea",
  parent: "godhome",
  connectsTo: ["godhome"],
  summary:
    "A circular shrine of statues inside Godhome. Each statue lets the Knight re-fight a boss at four escalating difficulty tiers: Attuned, Ascended, and Radiant.",
  verified: false,
  wikiSlug: "Hall_of_Gods",
  sources: ["https://hollowknight.fandom.com/wiki/Hall_of_Gods"],
});

export default data;
