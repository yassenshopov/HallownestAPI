import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "colosseum-of-fools",
  name: "Colosseum of Fools",
  game: "hk",
  kind: "subarea",
  parent: "kingdoms-edge",
  connectsTo: ["kingdoms-edge"],
  summary:
    "A gladiatorial arena run by Little Fool. Hosts three escalating trials: Warrior, Conqueror, and Fool — with the God Tamer and Zote the Mighty as bosses.",
  verified: false,
  wikiSlug: "Colosseum_of_Fools",
  sources: ["https://hollowknight.fandom.com/wiki/Colosseum_of_Fools"],
});

export default data;
