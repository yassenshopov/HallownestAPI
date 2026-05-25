import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "fog-canyon",
  name: "Fog Canyon",
  game: "hk",
  kind: "region",
  connectsTo: [
    "greenpath",
    "fungal-wastes",
    "queens-gardens",
    "overgrown-mound",
    "teachers-archives",
  ],
  music: "Fog Canyon",
  summary:
    "A central, jellyfish-drifted region of acidic clouds. The Teacher's Archives host Uumuu, and the Crystal Heart's path threads its eastern wall.",
  description:
    "Notable for its motion through clusters of explosive Uomas. Connects Greenpath, Fungal Wastes and Queen's Gardens with a vertical wind-tunnel feel.",
  verified: false,
  wikiSlug: "Fog_Canyon",
  sources: ["https://hollowknight.fandom.com/wiki/Fog_Canyon"],
});

export default data;
