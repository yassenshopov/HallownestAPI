import { BossSchema, type Boss } from "@/lib/schema";

const data: Boss = BossSchema.parse({
  slug: "winged-nosk",
  name: "Winged Nosk",
  game: "hk",
  optional: true,
  hp: { base: 800 },
  geo: 0,
  area: { slug: "godhome", name: "Godhome" },
  attacks: [
    { name: "Aerial dive" },
    { name: "Hanging ambush" },
    { name: "Doppelgänger drop" },
  ],
  summary:
    "A Godhome-only variant of Nosk that hangs from the ceiling and divebombs from above. Only fightable inside the Hall of Gods or the higher Pantheons.",
  verified: false,
  wikiSlug: "Winged_Nosk",
  sources: ["https://hollowknight.fandom.com/wiki/Winged_Nosk"],
});

export default data;
