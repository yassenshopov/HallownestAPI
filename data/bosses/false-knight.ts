import { BossSchema, type Boss } from "@/lib/schema";

const data: Boss = BossSchema.parse({
  slug: "false-knight",
  name: "False Knight",
  game: "hk",
  optional: false,
  hp: { base: 300 },
  geo: 200,
  area: { slug: "forgotten-crossroads", name: "Forgotten Crossroads" },
  phases: [
    {
      name: "Armoured rampage",
      description:
        "Hops, slams, and swings a massive mace. Stunned briefly after each slam.",
    },
    {
      name: "Exposed maggot",
      description:
        "After enough damage, the armour cracks open and the maggot inside is exposed for direct hits.",
    },
  ],
  attacks: [
    { name: "Mace swing" },
    { name: "Ground slam", description: "Releases falling debris from the ceiling." },
    { name: "Charge jump" },
  ],
  rewards: ["City Crest"],
  hunterJournal: {
    notes:
      "A self-styled knight guarding the entrance to the Crossroads. Wields a stolen mace far larger than itself.",
  },
  summary:
    "First major boss of Hollow Knight. Guards the way deeper into the Forgotten Crossroads. Has an armoured phase and a vulnerable maggot phase.",
  verified: false,
  wikiSlug: "False_Knight",
  sources: ["https://hollowknight.fandom.com/wiki/False_Knight"],
});

export default data;
