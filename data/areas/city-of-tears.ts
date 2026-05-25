import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "city-of-tears",
  name: "City of Tears",
  game: "hk",
  kind: "region",
  connectsTo: [
    "fungal-wastes",
    "royal-waterways",
    "crystal-peak",
    "ancient-basin",
    "resting-grounds",
    "kingdoms-edge",
    "kings-station",
    "soul-sanctum",
    "pleasure-house",
    "tower-of-love",
  ],
  stagStation: "City Storerooms, King's Station",
  music: { title: "City of Tears", spotifyTrackId: "0nD62ke95NJvAI8chsRjRg" },
  summary:
    "The rain-soaked capital of Hallownest. Central crossroads of the lower kingdom and home to the Watcher Knights, Soul Master, and the Collector.",
  description:
    "Five Stag stations branch from here; the Soul Sanctum, Pleasure House, King's Station, and Tower of Love are all sub-districts. Always raining inside.",
  verified: false,
  wikiSlug: "City_of_Tears",
  sources: ["https://hollowknight.fandom.com/wiki/City_of_Tears"],
});

export default data;
