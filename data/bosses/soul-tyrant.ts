import { BossSchema, type Boss } from "@/lib/schema";

const data: Boss = BossSchema.parse({
  slug: "soul-tyrant",
  name: "Soul Tyrant",
  game: "hk",
  optional: true,
  hp: { base: 800 },
  geo: 0,
  area: { slug: "city-of-tears", name: "City of Tears" },
  phases: [
    { name: "Sanctum duel" },
    { name: "Fallen Tyrant" },
  ],
  attacks: [
    { name: "Soul orbs (denser)" },
    { name: "Soul slam (faster)" },
    { name: "Teleport pursuit" },
  ],
  rewards: ["Essence (400)"],
  summary:
    "Dream variant of the Soul Master, fought in the same arena. Both phases are faster and orb patterns are denser.",
  verified: false,
  wikiSlug: "Soul_Tyrant",
  sources: ["https://hollowknight.fandom.com/wiki/Soul_Tyrant"],
});

export default data;
