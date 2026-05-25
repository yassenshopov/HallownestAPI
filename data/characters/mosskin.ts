import { CharacterSchema, type Character } from "@/lib/schema";

const data: Character = CharacterSchema.parse({
  slug: "mosskin",
  name: "Mosskin",
  game: "hk",
  kind: "enemy",
  role: "Moss bug",
  area: { slug: "greenpath", name: "Greenpath" },
  hp: 12,
  damage: 1,
  geoDrop: 4,
  hunterJournal: {
    notes:
      "Common Greenpath inhabitant. Lives under moss until it senses a threat, then pops up to swing.",
  },
  summary:
    "Greenpath's bread-and-butter enemy. Stays buried in moss-patches and lunges out at close range.",
  verified: false,
  wikiSlug: "Mosskin",
  sources: ["https://hollowknight.fandom.com/wiki/Mosskin"],
});

export default data;
