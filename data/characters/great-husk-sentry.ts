import { CharacterSchema, type Character } from "@/lib/schema";

const data: Character = CharacterSchema.parse({
  slug: "great-husk-sentry",
  name: "Great Husk Sentry",
  game: "hk",
  kind: "enemy",
  role: "Elite city guard",
  area: { slug: "city-of-tears", name: "City of Tears" },
  hp: 250,
  damage: 1,
  geoDrop: 60,
  hunterJournal: {
    notes:
      "Towering veteran sentry, draped in tattered banner. Swings a giant nail and slams the ground, sending shockwaves rolling out.",
  },
  summary:
    "City guard mini-boss patrolling Soul Sanctum's approaches and the upper streets. Two staggering ground slams and one heavy diagonal swing.",
  verified: false,
  wikiSlug: "Great_Husk_Sentry",
  sources: ["https://hollowknight.fandom.com/wiki/Great_Husk_Sentry"],
});

export default data;
