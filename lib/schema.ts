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

export const BossImageSchema = z.object({
  url: z.string().url(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  attribution: z.string().optional(),
  license: z.string().optional(),
});
export type BossImage = z.infer<typeof BossImageSchema>;

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
  image: BossImageSchema.optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Boss = z.infer<typeof BossSchema>;

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
