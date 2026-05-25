import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "palace-grounds",
  name: "Palace Grounds",
  game: "hk",
  kind: "subarea",
  parent: "ancient-basin",
  connectsTo: ["ancient-basin", "white-palace"],
  summary:
    "The hollowed forecourt where the White Palace once stood. The dream entrance into the Palace itself is anchored here.",
  verified: false,
  wikiSlug: "Palace_Grounds",
  sources: ["https://hollowknight.fandom.com/wiki/Palace_Grounds"],
});

export default data;
