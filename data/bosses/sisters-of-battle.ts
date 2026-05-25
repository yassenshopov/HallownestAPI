import { BossSchema, type Boss } from "@/lib/schema";

const data: Boss = BossSchema.parse({
  slug: "sisters-of-battle",
  name: "Sisters of Battle",
  game: "hk",
  optional: true,
  hp: { base: 530 },
  geo: 0,
  area: { slug: "godhome", name: "Godhome" },
  phases: [
    { name: "Two attacking together" },
    { name: "All three in the arena" },
  ],
  attacks: [
    { name: "Dash slash" },
    { name: "Pogo throw" },
    { name: "Triple counter pose" },
  ],
  summary:
    "The Godhome ascended form of the Mantis Lords. All three sisters attack at once with no pacing breaks, with new dive patterns layered on top of the base fight.",
  verified: false,
  wikiSlug: "Sisters_of_Battle",
  sources: ["https://hollowknight.fandom.com/wiki/Sisters_of_Battle"],
});

export default data;
