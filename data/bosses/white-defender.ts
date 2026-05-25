import { BossSchema, type Boss } from "@/lib/schema";

const data: Boss = BossSchema.parse({
  slug: "white-defender",
  name: "White Defender",
  game: "hk",
  optional: true,
  hp: { base: 850 },
  geo: 0,
  area: { slug: "royal-waterways", name: "Royal Waterways" },
  attacks: [
    { name: "Dung ball storm" },
    { name: "Dung wave" },
    { name: "Underground spike geyser" },
  ],
  rewards: ["Essence (300, then 100 per repeat)"],
  summary:
    "Dream variant of the Dung Defender, reachable via his nap spot after the fight. Adds spike geysers and rapid ball storms. Repeatable for diminishing essence.",
  verified: false,
  wikiSlug: "White_Defender",
  sources: ["https://hollowknight.fandom.com/wiki/White_Defender"],
});

export default data;
