import { BossSchema, type Boss } from "@/lib/schema";

const data: Boss = BossSchema.parse({
  slug: "soul-master",
  name: "Soul Master",
  game: "hk",
  optional: false,
  hp: { base: 380 },
  geo: 0,
  area: { slug: "city-of-tears", name: "City of Tears" },
  phases: [
    { name: "Soul Sanctum duel", description: "Floats and dives with telegraphed slams." },
    { name: "Fallen Master", description: "Drops to the floor below and the fight resumes in a new room." },
  ],
  attacks: [
    { name: "Soul orbs" },
    { name: "Soul slam" },
    { name: "Teleport" },
  ],
  rewards: ["Desolate Dive spell"],
  summary:
    "Head of the Soul Sanctum. A two-phase fight that rewards the Desolate Dive spell. Once finished, his soul lingers and can be challenged again as Soul Tyrant.",
  verified: false,
  wikiSlug: "Soul_Master",
  sources: ["https://hollowknight.fandom.com/wiki/Soul_Master"],
});

export default data;
