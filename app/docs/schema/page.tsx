import type { Metadata } from "next";

import { CodeBlock } from "@/components/code-block";
import { DocsPage, DocsSection } from "@/components/docs-shell";

export const metadata: Metadata = {
  title: "Schema",
  description: "Zod schemas powering HallownestAPI.",
};

const bossSchema = `import { z } from "zod";

export const GameSchema = z.enum(["hk", "silksong"]);

export const AreaRefSchema = z.object({
  slug: z.string(),
  name: z.string(),
});

export const BossSchema = z.object({
  slug: z.string(),                       // kebab-case
  name: z.string(),
  game: GameSchema,
  optional: z.boolean().default(false),
  hp: z.record(z.enum(["base","attuned","ascended","radiant"]), z.number()).optional(),
  geo: z.number().int().optional(),
  area: AreaRefSchema,
  phases: z.array(z.object({
    name: z.string(),
    hp: z.number().optional(),
    description: z.string().optional(),
  })).optional(),
  attacks: z.array(z.object({
    name: z.string(),
    damage: z.number().optional(),
    description: z.string().optional(),
  })).optional(),
  rewards: z.array(z.string()).optional(),
  pantheon: z.array(z.string()).optional(),
  hunterJournal: z.object({
    entryNumber: z.number().optional(),
    notes: z.string().optional(),
  }).optional(),
  summary: z.string(),
  verified: z.boolean().default(false),
  sources: z.array(z.string().url()).optional(),
  updatedAt: z.string().datetime().optional(),
});`;

export default function SchemaDocsPage() {
  return (
    <DocsPage
      eyebrow="Reference"
      title="Schema"
      description="HallownestAPI is schema-first. Every entity is validated with Zod, both on import and at request time."
    >
      <DocsSection title="Boss">
        <p>
          The boss entity. Required fields are <code className="font-mono">slug</code>,{" "}
          <code className="font-mono">name</code>, <code className="font-mono">game</code>,{" "}
          <code className="font-mono">area</code>, and <code className="font-mono">summary</code>.
        </p>
        <CodeBlock title="lib/schema.ts" language="ts" code={bossSchema} />
      </DocsSection>

      <DocsSection title="Conventions">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <code className="font-mono">slug</code>: lowercase ASCII kebab-case. Stable. Never
            reused.
          </li>
          <li>
            <code className="font-mono">verified</code>: set to <code className="font-mono">true</code> only after a
            contributor has cross-referenced the value with the game.
          </li>
          <li>
            <code className="font-mono">hp</code>: a record keyed by difficulty tier. <code className="font-mono">base</code> is the
            unmodified value; <code className="font-mono">attuned</code> / <code className="font-mono">ascended</code> /{" "}
            <code className="font-mono">radiant</code> are HK’s Godhome scalings.
          </li>
          <li>
            <code className="font-mono">sources</code>: external URLs that justify the data —
            wiki pages, decompilation dumps, dev notes.
          </li>
        </ul>
      </DocsSection>
    </DocsPage>
  );
}
