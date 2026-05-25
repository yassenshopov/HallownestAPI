import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "spirits-glade",
  name: "Spirit's Glade",
  game: "hk",
  kind: "subarea",
  parent: "resting-grounds",
  connectsTo: ["resting-grounds"],
  summary:
    "A peaceful grove of Whispering Roots and slumbering souls. The Seer lives here, trading dream essence for charms and notches.",
  verified: false,
  wikiSlug: "Spirit%27s_Glade",
  sources: ["https://hollowknight.fandom.com/wiki/Spirit%27s_Glade"],
});

export default data;
