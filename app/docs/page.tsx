import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { DocsPage, DocsSection } from "@/components/docs-shell";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Get started with HallownestAPI — endpoints, schemas, and conventions.",
};

export default function DocsIndex() {
  return (
    <DocsPage
      eyebrow="Introduction"
      title="HallownestAPI"
      description="An open, structured data API for Hollow Knight and Silksong. Free, fan-made, non-commercial."
    >
      <DocsSection title="What it is">
        <p>
          HallownestAPI exposes <strong>facts</strong> about the Hollow Knight games — boss
          HP, area names, item references, geo drops — as a stable REST JSON API. It is
          modeled on{" "}
          <a
            href="https://pokeapi.co"
            target="_blank"
            rel="noreferrer noopener"
            className="underline-offset-4 hover:underline"
          >
            PokeAPI
          </a>
          : predictable URLs, JSON in / JSON out, no API key required.
        </p>
        <p>
          It is <em>not</em> a wiki. We do not host game assets, sprites, or copyrighted
          lore text — we link out to{" "}
          <a
            href="https://hollowknight.fandom.com/"
            target="_blank"
            rel="noreferrer noopener"
            className="underline-offset-4 hover:underline"
          >
            community wikis
          </a>{" "}
          for that.
        </p>
      </DocsSection>

      <DocsSection title="Make your first request">
        <CodeBlock
          language="bash"
          code={`curl https://hallownestapi.dev/api/v1/boss/false-knight`}
        />
        <p>
          That&apos;s it. See{" "}
          <Link href="/docs/quickstart" className="underline-offset-4 hover:underline">
            Quickstart
          </Link>{" "}
          for a TypeScript example or{" "}
          <Link href="/docs/endpoints" className="underline-offset-4 hover:underline">
            Endpoints
          </Link>{" "}
          for the full list.
        </p>
      </DocsSection>

      <DocsSection title="Status">
        <p>
          HallownestAPI is in <strong>v0 early preview</strong>. Only{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">boss</code>{" "}
          is currently exposed and seeded with a handful of entries. Expect breaking changes
          until v1.
        </p>
      </DocsSection>
    </DocsPage>
  );
}
