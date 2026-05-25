import { z } from "zod";

export const GameSchema = z.enum(["hk", "silksong"]);
export type Game = z.infer<typeof GameSchema>;

export const GAMES: Record<Game, { id: Game; name: string }> = {
  hk: { id: "hk", name: "Hollow Knight" },
  silksong: { id: "silksong", name: "Hollow Knight: Silksong" },
};

export const slug = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "slug must be kebab-case lowercase alphanumeric",
  });

export const AreaRefSchema = z.object({
  slug: slug,
  name: z.string(),
});
export type AreaRef = z.infer<typeof AreaRefSchema>;

export const BossAttackSchema = z.object({
  name: z.string(),
  damage: z.number().int().nonnegative().optional(),
  description: z.string().optional(),
});

export const BossPhaseSchema = z.object({
  name: z.string(),
  hp: z.number().int().positive().optional(),
  description: z.string().optional(),
});

export const BossDifficultyTierSchema = z.enum([
  "base",
  "attuned",
  "ascended",
  "radiant",
]);
export type BossDifficultyTier = z.infer<typeof BossDifficultyTierSchema>;

export const BossHpSchema = z
  .object({
    base: z.number().int().positive().optional(),
    attuned: z.number().int().positive().optional(),
    ascended: z.number().int().positive().optional(),
    radiant: z.number().int().positive().optional(),
  })
  .partial();

// -----------------------------------------------------------------------------
// Music (shared by Area + Boss)
// -----------------------------------------------------------------------------

// Spotify track IDs are 22-character base62 strings.
const spotifyTrackId = z.string().regex(/^[A-Za-z0-9]{22}$/, {
  message: "spotifyTrackId must be a 22-character Spotify track ID",
});

// Music track reference. Accepts either a plain string (legacy/unknown track)
// or a richer object with a Spotify track ID. Always normalises to the object
// form so callers (UI, API consumers) get a consistent shape.
export const MusicTrackSchema = z.preprocess(
  (val) => (typeof val === "string" ? { title: val } : val),
  z.object({
    /** Display name of the in-game music theme. */
    title: z.string(),
    /** Spotify track ID — present when the theme has an official release. */
    spotifyTrackId: spotifyTrackId.optional(),
  }),
);
export type MusicTrack = z.infer<typeof MusicTrackSchema>;

export const BossSchema = z.object({
  slug: slug,
  name: z.string(),
  game: GameSchema,
  optional: z.boolean().default(false),
  hp: BossHpSchema.optional(),
  geo: z.number().int().nonnegative().optional(),
  area: AreaRefSchema,
  phases: z.array(BossPhaseSchema).optional(),
  attacks: z.array(BossAttackSchema).optional(),
  rewards: z.array(z.string()).optional(),
  pantheon: z.array(z.string()).optional(),
  hunterJournal: z
    .object({
      entryNumber: z.number().int().optional(),
      notes: z.string().optional(),
    })
    .optional(),
  summary: z.string(),
  verified: z.boolean().default(false),
  sources: z.array(z.string().url()).optional(),
  wikiSlug: z.string().optional(),
  wikiUrl: z.string().url().optional(),
  /** Boss-fight theme — references the Spotify track when one exists. */
  music: MusicTrackSchema.optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Boss = z.infer<typeof BossSchema>;

// -----------------------------------------------------------------------------
// Character (NPCs, merchants, enemies, dream warriors)
// -----------------------------------------------------------------------------

export const CharacterKindSchema = z.enum([
  "npc",
  "merchant",
  "enemy",
  "warrior",
]);
export type CharacterKind = z.infer<typeof CharacterKindSchema>;

export const CHARACTER_KINDS: Record<
  CharacterKind,
  { id: CharacterKind; name: string; plural: string }
> = {
  npc: { id: "npc", name: "NPC", plural: "NPCs" },
  merchant: { id: "merchant", name: "Merchant", plural: "Merchants" },
  enemy: { id: "enemy", name: "Enemy", plural: "Enemies" },
  warrior: { id: "warrior", name: "Dream Warrior", plural: "Dream Warriors" },
};

export const CharacterSchema = z.object({
  slug: slug,
  name: z.string(),
  game: GameSchema,
  kind: CharacterKindSchema,
  /** Free-form role / occupation ("Cartographer", "Wanderer", "Charm Seller"). */
  role: z.string().optional(),
  /** Primary area where the character is encountered. */
  area: AreaRefSchema.optional(),
  /** Additional named locations (rooms / sub-areas) within the area. */
  location: z.string().optional(),
  /** Whether the character also has a dedicated boss fight (or is a boss). */
  isBoss: z.boolean().default(false),
  /** Slug of the corresponding boss entry, if any. */
  bossSlug: slug.optional(),
  /** Items / services offered by merchants. Free text per entry. */
  sells: z.array(z.string()).default([]),
  // ----- Enemy-only combat stats (Hunter's Journal style) -----
  /** HP for enemies. Bosses live under /boss with richer hp tiers. */
  hp: z.number().int().positive().optional(),
  /** Contact / nail damage dealt to the Knight in masks (1 mask = 1). */
  damage: z.number().int().nonnegative().optional(),
  /** Average geo dropped on death. */
  geoDrop: z.number().int().nonnegative().optional(),
  hunterJournal: z
    .object({
      entryNumber: z.number().int().optional(),
      notes: z.string().optional(),
    })
    .optional(),
  summary: z.string(),
  description: z.string().optional(),
  verified: z.boolean().default(false),
  sources: z.array(z.string().url()).optional(),
  wikiSlug: z.string().optional(),
  wikiUrl: z.string().url().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Character = z.infer<typeof CharacterSchema>;

// -----------------------------------------------------------------------------
// Areas (regions of Hallownest + their named sub-areas)
// -----------------------------------------------------------------------------

export const AreaKindSchema = z.enum(["region", "subarea"]);
export type AreaKind = z.infer<typeof AreaKindSchema>;

export const AREA_KINDS: Record<
  AreaKind,
  { id: AreaKind; name: string; plural: string }
> = {
  region: { id: "region", name: "Region", plural: "Regions" },
  subarea: { id: "subarea", name: "Sub-area", plural: "Sub-areas" },
};

export const AreaSchema = z.object({
  slug: slug,
  name: z.string(),
  game: GameSchema,
  kind: AreaKindSchema.default("region"),
  /** Slug of the parent region if this entry is a sub-area. */
  parent: slug.optional(),
  /** Adjacent areas reachable from this one (slug only — names resolved at runtime). */
  connectsTo: z.array(slug).default([]),
  /** Stag station name(s) inside the area, if any. */
  stagStation: z.string().optional(),
  /**
   * Theme of the area's ambient track. Accepts a bare string for legacy
   * entries; canonical entries should provide `{ title, spotifyTrackId }` so
   * the UI can deep-link to the song on Spotify.
   */
  music: MusicTrackSchema.optional(),
  /** Brief one-liner. */
  summary: z.string(),
  description: z.string().optional(),
  verified: z.boolean().default(false),
  sources: z.array(z.string().url()).optional(),
  wikiSlug: z.string().optional(),
  wikiUrl: z.string().url().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Area = z.infer<typeof AreaSchema>;

// -----------------------------------------------------------------------------
// Charms
// -----------------------------------------------------------------------------

export const CharmAcquisitionSchema = z.enum([
  "purchase",
  "find",
  "quest",
  "boss",
  "geo-cost",
  "story",
]);
export type CharmAcquisition = z.infer<typeof CharmAcquisitionSchema>;

export const CharmSchema = z.object({
  slug: slug,
  name: z.string(),
  game: GameSchema,
  /** Notch slots required to equip. Most charms 1–4; Kingsoul is 5, Void Heart is 0. */
  notchCost: z.number().int().min(0).max(5),
  /** Order shown on the in-game charm grid. Optional; only filled when known. */
  inventoryOrder: z.number().int().positive().optional(),
  /** Slug of a base/upgraded counterpart (Fragile↔Unbreakable, Kingsoul↔Void Heart, etc.). */
  upgradeOf: slug.optional(),
  upgradesTo: slug.optional(),
  /** Whether the charm "overcharms" — pulses red when notch capacity is exceeded. */
  fragile: z.boolean().default(false),
  /** Short tagline (Hollow Knight charm description text). */
  effect: z.string(),
  /** Mechanical breakdown — what the buff/debuff actually does. */
  description: z.string().optional(),
  /** Geo price if bought from a merchant. */
  cost: z.number().int().nonnegative().optional(),
  /** Free text describing where to acquire the charm. */
  location: z.string().optional(),
  /** Primary area of acquisition. */
  area: AreaRefSchema.optional(),
  /** Merchant slug, if sold. */
  merchant: slug.optional(),
  acquisition: CharmAcquisitionSchema.optional(),
  /** Slugs of charms that interact / synergize with this one. */
  synergies: z.array(slug).default([]),
  summary: z.string(),
  verified: z.boolean().default(false),
  sources: z.array(z.string().url()).optional(),
  wikiSlug: z.string().optional(),
  wikiUrl: z.string().url().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Charm = z.infer<typeof CharmSchema>;

// -----------------------------------------------------------------------------
// Skills (movement abilities, spells, nail arts, dream abilities)
// -----------------------------------------------------------------------------

export const SkillKindSchema = z.enum([
  "movement",
  "spell",
  "nail-art",
  "dream",
]);
export type SkillKind = z.infer<typeof SkillKindSchema>;

export const SKILL_KINDS: Record<
  SkillKind,
  { id: SkillKind; name: string; plural: string }
> = {
  movement: { id: "movement", name: "Movement", plural: "Movement abilities" },
  spell: { id: "spell", name: "Spell", plural: "Spells" },
  "nail-art": { id: "nail-art", name: "Nail Art", plural: "Nail Arts" },
  dream: { id: "dream", name: "Dream", plural: "Dream abilities" },
};

export const SkillSchema = z.object({
  slug: slug,
  name: z.string(),
  game: GameSchema,
  kind: SkillKindSchema,
  /** Soul cost for spells, in units of 33 SOUL. Movement skills typically 0. */
  soulCost: z.number().int().nonnegative().optional(),
  /** Damage dealt, when applicable (spells, nail arts). */
  damage: z.number().int().nonnegative().optional(),
  /** Short in-game description, when one exists. */
  effect: z.string().optional(),
  /** Mechanical breakdown. */
  description: z.string().optional(),
  /** How the Knight obtains the skill. */
  acquisition: z.string().optional(),
  /** Primary area of acquisition. */
  area: AreaRefSchema.optional(),
  /** Slug of a base/upgraded counterpart (Vengeful Spirit ↔ Shade Soul, etc.). */
  upgradeOf: slug.optional(),
  upgradesTo: slug.optional(),
  summary: z.string(),
  verified: z.boolean().default(false),
  sources: z.array(z.string().url()).optional(),
  wikiSlug: z.string().optional(),
  wikiUrl: z.string().url().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Skill = z.infer<typeof SkillSchema>;

export const PaginatedSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    count: z.number().int().nonnegative(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(item),
  });

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
