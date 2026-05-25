import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "godhome",
  name: "Godhome",
  game: "hk",
  kind: "region",
  connectsTo: ["junk-pit", "hall-of-gods", "pantheons"],
  music: { title: "Godhome", spotifyTrackId: "4AlK8tRaBaehJ8eQiEqe8l" },
  summary:
    "The Godseekers' dream-temple. Hosts the Hall of Gods rematches and the five Pantheons that culminate in Absolute Radiance.",
  verified: false,
  wikiSlug: "Godhome",
  sources: ["https://hollowknight.fandom.com/wiki/Godhome"],
});

export default data;
