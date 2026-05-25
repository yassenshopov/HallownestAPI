import { CharacterSchema, type Character } from "@/lib/schema";

const data: Character = CharacterSchema.parse({
  slug: "leaping-husk",
  name: "Leaping Husk",
  game: "hk",
  kind: "enemy",
  role: "Pouncing infected",
  area: { slug: "forgotten-crossroads", name: "Forgotten Crossroads" },
  hp: 20,
  damage: 1,
  geoDrop: 5,
  hunterJournal: {
    notes:
      "Once a hunter or scavenger. Springs forward with surprising distance, mouth-first.",
  },
  summary:
    "Husk variant that lunges over short distances. Closes gaps faster than the Wandering Husk.",
  verified: false,
  wikiSlug: "Leaping_Husk",
  sources: ["https://hollowknight.fandom.com/wiki/Leaping_Husk"],
});

export default data;
