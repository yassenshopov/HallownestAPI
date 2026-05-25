import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "fungal-wastes",
  name: "Fungal Wastes",
  game: "hk",
  kind: "region",
  connectsTo: [
    "forgotten-crossroads",
    "fog-canyon",
    "city-of-tears",
    "deepnest",
    "queens-station",
    "mantis-village",
    "fungal-core",
  ],
  stagStation: "Queen's Station",
  music: { title: "Fungal Wastes", spotifyTrackId: "372ottv1RRZdzqAkywYMpA" },
  summary:
    "A region of bouncing mushrooms and aggressive Mantis tribes. Hosts Queen's Station, the Mantis Lords, and Cornifer's wife Iselda's old route.",
  description:
    "The shrooms spring the Knight through pogo-friendly chambers. Beating the Mantis Lords opens the path to Deepnest.",
  verified: false,
  wikiSlug: "Fungal_Wastes",
  sources: ["https://hollowknight.fandom.com/wiki/Fungal_Wastes"],
});

export default data;
