import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";
import { DocsPage, DocsSection } from "@/components/docs-shell";

export const metadata: Metadata = {
  title: "Endpoints",
  description: "Reference for every HallownestAPI v1 endpoint.",
};

export default function EndpointsPage() {
  return (
    <DocsPage
      eyebrow="Reference"
      title="Endpoints"
      description="HallownestAPI v1 — REST, no auth, JSON responses."
    >
      <DocsSection title="Base URL">
        <CodeBlock language="bash" code={`https://hallownestapi.dev/api/v1`} />
      </DocsSection>

      <DocsSection title="Conventions">
        <ul className="list-disc space-y-1 pl-5">
          <li>Slugs are kebab-case ASCII (e.g. <code className="font-mono">false-knight</code>).</li>
          <li>List endpoints accept <code className="font-mono">limit</code> (1–100, default 20) and <code className="font-mono">offset</code> (default 0).</li>
          <li>Errors return JSON with an <code className="font-mono">error</code> code and a human <code className="font-mono">message</code> or <code className="font-mono">details</code>.</li>
          <li>All responses are cached at the edge — typically 1h with SWR.</li>
        </ul>
      </DocsSection>

      <Endpoint
        method="GET"
        path="/api/v1"
        description="Root index. Lists available endpoints."
        example={`{
  "name": "HallownestAPI",
  "version": "v1",
  "endpoints": { "bosses": ".../boss", "boss": ".../boss/{slug}" }
}`}
      />

      <Endpoint
        method="GET"
        path="/api/v1/boss"
        description="Paginated list of bosses. Filterable."
        params={[
          { name: "game", type: "hk | silksong", desc: "Filter by game." },
          { name: "search", type: "string", desc: "Substring match on name, slug, or area." },
          { name: "limit", type: "number", desc: "1–100, default 20." },
          { name: "offset", type: "number", desc: "Default 0." },
        ]}
        example={`{
  "count": 4,
  "next": null,
  "previous": null,
  "results": [
    {
      "slug": "false-knight",
      "name": "False Knight",
      "game": "hk",
      "area": { "slug": "forgotten-crossroads", "name": "Forgotten Crossroads" },
      "optional": false,
      "url": "https://hallownestapi.dev/api/v1/boss/false-knight"
    }
  ]
}`}
      />

      <Endpoint
        method="GET"
        path="/api/v1/boss/{slug}"
        description="Full payload for a single boss."
        example={`{
  "slug": "false-knight",
  "name": "False Knight",
  "game": "hk",
  "hp": { "base": 300 },
  "geo": 200,
  "area": { "slug": "forgotten-crossroads", "name": "Forgotten Crossroads" },
  "phases": [{ "name": "Armoured rampage" }, { "name": "Exposed maggot" }],
  "summary": "..."
}`}
      />
    </DocsPage>
  );
}

function Endpoint({
  method,
  path,
  description,
  params,
  example,
}: {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  params?: { name: string; type: string; desc: string }[];
  example: string;
}) {
  return (
    <section className="space-y-3 rounded-lg border border-border/60 bg-card/40 p-5">
      <header className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="font-mono text-xs">
          {method}
        </Badge>
        <code className="font-mono text-sm">{path}</code>
      </header>
      <p className="text-sm text-muted-foreground">{description}</p>

      {params?.length ? (
        <div className="rounded-md border border-border/60">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Param</th>
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {params.map((p) => (
                <tr key={p.name} className="border-t border-border/60">
                  <td className="px-3 py-2 font-mono text-xs">{p.name}</td>
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{p.type}</td>
                  <td className="px-3 py-2 text-muted-foreground">{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <CodeBlock title="Example response" language="json" code={example} />
    </section>
  );
}
