import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "white-palace",
  name: "White Palace",
  game: "hk",
  kind: "region",
  connectsTo: ["palace-grounds", "path-of-pain"],
  music: { title: "White Palace", spotifyTrackId: "1aIcb5s4idJeItJV4vaVtW" },
  summary:
    "The Pale King's dream-locked palace, accessed only via the dream nail. A precision-platforming pilgrimage to retrieve the King's Brand.",
  verified: false,
  wikiSlug: "White_Palace",
  sources: ["https://hollowknight.fandom.com/wiki/White_Palace"],
});

export default data;
