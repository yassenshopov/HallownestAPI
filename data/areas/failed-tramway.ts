import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "failed-tramway",
  name: "Failed Tramway",
  game: "hk",
  kind: "subarea",
  parent: "deepnest",
  connectsTo: ["deepnest"],
  summary:
    "A collapsed segment of the old Tram line through Deepnest. The Tram Pass opens its sealed gates.",
  verified: false,
  wikiSlug: "Tram",
  sources: ["https://hollowknight.fandom.com/wiki/Tram"],
});

export default data;
