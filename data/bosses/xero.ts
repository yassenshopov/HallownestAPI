import { BossSchema, type Boss } from "@/lib/schema";

const data: Boss = BossSchema.parse({
  slug: "xero",
  name: "Xero",
  game: "hk",
  optional: true,
  hp: { base: 250 },
  geo: 0,
  area: { slug: "resting-grounds", name: "Resting Grounds" },
  attacks: [
    { name: "Floating nails", description: "Six homing nails that orbit and dive." },
  ],
  rewards: ["Essence (100)"],
  summary:
    "A Dream Warrior fought in the Resting Grounds graveyard. The whole fight is about reading the orbits of six homing nails while staying mobile.",
  verified: false,
  wikiSlug: "Xero",
  sources: ["https://hollowknight.fandom.com/wiki/Xero"],
});

export default data;
