import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "fungal-core",
  name: "Fungal Core",
  game: "hk",
  kind: "subarea",
  parent: "fungal-wastes",
  connectsTo: ["fungal-wastes"],
  summary:
    "A deeper bouncing-shroom labyrinth below the Wastes. Houses the Flukenest charm and the Brooding Mawlek's old siblings.",
  verified: false,
  wikiSlug: "Fungal_Wastes",
  sources: ["https://hollowknight.fandom.com/wiki/Fungal_Wastes"],
});

export default data;
