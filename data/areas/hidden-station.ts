import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "hidden-station",
  name: "Hidden Station",
  game: "hk",
  kind: "subarea",
  parent: "ancient-basin",
  connectsTo: ["ancient-basin"],
  stagStation: "Hidden Station",
  summary:
    "A long-forgotten Stag station in the Ancient Basin, walled off until the Knight breaches it from below.",
  verified: false,
  wikiSlug: "Hidden_Station",
  sources: ["https://hollowknight.fandom.com/wiki/Hidden_Station"],
});

export default data;
