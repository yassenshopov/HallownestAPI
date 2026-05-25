import type { Metadata } from "next";

import { CodeBlock } from "@/components/code-block";
import { DocsPage, DocsSection } from "@/components/docs-shell";

export const metadata: Metadata = {
  title: "Contributing",
  description: "How to add or correct data in HallownestAPI.",
};

export default function ContributingPage() {
  return (
    <DocsPage
      eyebrow="Project"
      title="Contributing"
      description="Every entity is a file in git. Pull requests are the contract."
    >
      <DocsSection title="Anatomy of an entry">
        <p>
          Data lives in <code className="font-mono">data/&lt;type&gt;/&lt;slug&gt;.ts</code>.
          Each file exports a single, Zod-parsed entity. Validation runs at module load —
          if you mis-type a field, the build fails.
        </p>
        <CodeBlock
          title="data/bosses/false-knight.ts"
          language="ts"
          code={`import { BossSchema, type Boss } from "@/lib/schema";

const data: Boss = BossSchema.parse({
  slug: "false-knight",
  name: "False Knight",
  game: "hk",
  hp: { base: 300 },
  geo: 200,
  area: { slug: "forgotten-crossroads", name: "Forgotten Crossroads" },
  summary: "First major boss of Hollow Knight...",
  verified: false,
  sources: ["https://hollowknight.fandom.com/wiki/False_Knight"],
});

export default data;`}
        />
      </DocsSection>

      <DocsSection title="Adding a new boss">
        <ol className="list-decimal space-y-2 pl-5">
          <li>Fork the repo.</li>
          <li>
            Add a new file at <code className="font-mono">data/bosses/&lt;slug&gt;.ts</code>.
          </li>
          <li>
            Register the import in <code className="font-mono">data/bosses/index.ts</code>.
          </li>
          <li>
            Run <code className="font-mono">npm run dev</code> and visit{" "}
            <code className="font-mono">/bosses/&lt;slug&gt;</code> to verify.
          </li>
          <li>Open a PR. Include a wiki link or in-game source in <code className="font-mono">sources</code>.</li>
        </ol>
      </DocsSection>

      <DocsSection title="Verification">
        <p>
          Set <code className="font-mono">verified: true</code> only if you have
          first-hand confirmation (you played the fight, or you cross-referenced the
          decompiled <code className="font-mono">Assembly-CSharp.dll</code>). Otherwise leave it{" "}
          <code className="font-mono">false</code> — the UI shows an “unverified” badge.
        </p>
      </DocsSection>
    </DocsPage>
  );
}
