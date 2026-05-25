import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "deep-focus-cavern",
  name: "Deep Focus Cavern",
  game: "hk",
  kind: "subarea",
  parent: "crystal-peak",
  connectsTo: ["crystal-peak"],
  summary:
    "A locked cavern behind a Simple-Key door in Crystal Peak. Holds the Deep Focus charm.",
  verified: false,
  wikiSlug: "Deep_Focus",
  sources: ["https://hollowknight.fandom.com/wiki/Deep_Focus"],
});

export default data;
