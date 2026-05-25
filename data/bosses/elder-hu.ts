import { BossSchema, type Boss } from "@/lib/schema";

const data: Boss = BossSchema.parse({
  slug: "elder-hu",
  name: "Elder Hu",
  game: "hk",
  optional: true,
  hp: { base: 350 },
  geo: 0,
  area: { slug: "resting-grounds", name: "Resting Grounds" },
  attacks: [
    { name: "Nail dash" },
    { name: "Tremor", description: "Slams the ground to summon shockwave columns." },
  ],
  rewards: ["Essence (100)"],
  summary:
    "A teacher-turned-Dream-Warrior in the Resting Grounds. Predictable dash-and-slam patterns; the difficulty is keeping a steady rhythm.",
  verified: false,
  wikiSlug: "Elder_Hu",
  sources: ["https://hollowknight.fandom.com/wiki/Elder_Hu"],
});

export default data;
