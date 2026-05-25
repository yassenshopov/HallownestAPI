import type { Metadata } from "next";

import { CodeBlock } from "@/components/code-block";
import { DocsPage, DocsSection } from "@/components/docs-shell";

export const metadata: Metadata = {
  title: "Quickstart",
  description: "Make your first HallownestAPI request in under a minute.",
};

export default function QuickstartPage() {
  return (
    <DocsPage
      eyebrow="Getting started"
      title="Quickstart"
      description="From zero to a parsed boss in three steps."
    >
      <DocsSection title="1. Pick an endpoint">
        <p>The two endpoints you’ll use most:</p>
        <ul className="list-disc space-y-1 pl-5 text-foreground/90">
          <li>
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
              /api/v1/boss
            </code>{" "}
            — paginated list, filterable by{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">game</code> and{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">search</code>.
          </li>
          <li>
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
              /api/v1/boss/{`{slug}`}
            </code>{" "}
            — full payload for a single boss.
          </li>
        </ul>
      </DocsSection>

      <DocsSection title="2. Fetch from anywhere">
        <CodeBlock
          title="curl"
          language="bash"
          code={`curl "https://hallownestapi.dev/api/v1/boss?game=hk&limit=5"`}
        />
        <CodeBlock
          title="TypeScript / fetch"
          language="ts"
          code={`type Boss = {
  slug: string;
  name: string;
  game: "hk" | "silksong";
  area: { slug: string; name: string };
  url: string;
};

const res = await fetch(
  "https://hallownestapi.dev/api/v1/boss?game=hk&limit=5",
);
const { results } = (await res.json()) as { results: Boss[] };
console.log(results.map((b) => b.name));`}
        />
        <CodeBlock
          title="Python"
          language="python"
          code={`import httpx

r = httpx.get("https://hallownestapi.dev/api/v1/boss/false-knight")
boss = r.json()
print(boss["name"], "—", boss["area"]["name"])`}
        />
      </DocsSection>

      <DocsSection title="3. Validate with Zod (optional)">
        <p>
          The same Zod schemas the server uses are available in the source — copy{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
            lib/schema.ts
          </code>{" "}
          into your project for end-to-end type safety.
        </p>
        <CodeBlock
          language="ts"
          code={`import { BossSchema } from "./schema";

const boss = BossSchema.parse(await res.json());`}
        />
      </DocsSection>
    </DocsPage>
  );
}
