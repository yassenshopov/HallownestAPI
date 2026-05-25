import { BossSchema, type Boss } from "@/lib/schema";

const data: Boss = BossSchema.parse({
  slug: "mantis-lords",
  name: "Mantis Lords",
  game: "hk",
  optional: true,
  hp: { base: 530 },
  geo: 0,
  area: { slug: "fungal-wastes", name: "Fungal Wastes" },
  phases: [
    {
      name: "Duel",
      description:
        "A single Mantis Lord engages first. After half HP, the remaining two attack together.",
    },
    {
      name: "Double team",
      description: "Two Mantis Lords attack simultaneously with synchronised patterns.",
    },
  ],
  attacks: [
    { name: "Dash slash" },
    { name: "Pogo throw", description: "Throws a needle into the floor or wall to pogo off." },
    { name: "Counter pose" },
  ],
  rewards: ["Mantis Claw access (story) — unlocks Deepnest entrance"],
  hunterJournal: {
    notes:
      "Three sisters ruling the Mantis Tribe. They honour challengers who prove themselves in single combat.",
  },
  summary:
    "An optional but iconic fight. Defeating them earns the respect of the Mantis Tribe and unlocks passage deeper into Hallownest.",
  verified: false,
  sources: ["https://hollowknight.fandom.com/wiki/Mantis_Lords"],
});

export default data;
