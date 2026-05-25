import { CharacterSchema, type Character } from "@/lib/schema";

const data: Character = CharacterSchema.parse({
  slug: "crawlid",
  name: "Crawlid",
  game: "hk",
  kind: "enemy",
  role: "Tiny crawling bug",
  area: { slug: "forgotten-crossroads", name: "Forgotten Crossroads" },
  hp: 5,
  damage: 1,
  geoDrop: 1,
  hunterJournal: {
    notes:
      "Mindless creature that crawls along the ground. The weakest thing the Knight will encounter, but worth a swing for the geo.",
  },
  summary:
    "The first enemy most players ever swing at. Walks back and forth on flat ground and does nothing else.",
  verified: false,
  wikiSlug: "Crawlid",
  sources: ["https://hollowknight.fandom.com/wiki/Crawlid"],
});

export default data;
