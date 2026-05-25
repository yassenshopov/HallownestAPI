import { BossSchema, type Boss } from "@/lib/schema";

const data: Boss = BossSchema.parse({
  slug: "vengefly-king",
  name: "Vengefly King",
  game: "hk",
  optional: true,
  hp: { base: 90 },
  geo: 40,
  area: { slug: "greenpath", name: "Greenpath" },
  attacks: [
    { name: "Dive" },
    { name: "Vengefly summon" },
  ],
  summary:
    "An oversized Vengefly that calls smaller kin to swarm the player. Encountered above the entrance to Greenpath in a hidden ledge fight.",
  verified: false,
  wikiSlug: "Vengefly_King",
  sources: ["https://hollowknight.fandom.com/wiki/Vengefly_King"],
});

export default data;
