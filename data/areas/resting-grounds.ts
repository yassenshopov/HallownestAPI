import { AreaSchema, type Area } from "@/lib/schema";

const data: Area = AreaSchema.parse({
  slug: "resting-grounds",
  name: "Resting Grounds",
  game: "hk",
  kind: "region",
  connectsTo: [
    "forgotten-crossroads",
    "city-of-tears",
    "crystal-peak",
    "blue-lake",
    "spirits-glade",
  ],
  stagStation: "Resting Grounds Stag",
  music: { title: "Resting Grounds", spotifyTrackId: "3QaFRJIXefCIaKk99rReFC" },
  summary:
    "The misty necropolis where the Seer awaits in a glade of moths. Acquisition point for the Dream Nail.",
  verified: false,
  wikiSlug: "Resting_Grounds",
  sources: ["https://hollowknight.fandom.com/wiki/Resting_Grounds"],
});

export default data;
