import type { Metadata } from "next";

import { DocsPage, DocsSection } from "@/components/docs-shell";

export const metadata: Metadata = {
  title: "Legal & attribution",
  description:
    "How HallownestAPI relates to Team Cherry, community wikis, and the law.",
};

export default function LegalPage() {
  return (
    <DocsPage
      eyebrow="Project"
      title="Legal & attribution"
      description="The short version: this is a non-commercial fan project. We host facts, not assets."
    >
      <DocsSection title="Trademarks">
        <p>
          <strong>Hollow Knight</strong>, <strong>Hollow Knight: Silksong</strong>, and{" "}
          <strong>Team Cherry</strong> are trademarks of{" "}
          <a
            href="https://www.teamcherry.com.au/"
            target="_blank"
            rel="noreferrer noopener"
            className="underline-offset-4 hover:underline"
          >
            Team Cherry
          </a>
          . HallownestAPI is unaffiliated with and not endorsed by Team Cherry.
        </p>
      </DocsSection>

      <DocsSection title="What we host (and what we don’t)">
        <p>
          We host <strong>facts</strong> — boss HP values, geo drop counts, area names,
          slugs, and brief original summaries. Facts are not copyrightable in most
          jurisdictions.
        </p>
        <p>
          We <strong>do not</strong> host: in-game sprites, portraits, music, copyrighted
          lore text, or any extracted asset. For art and lore we link out to community
          wikis. If a contribution accidentally includes copyrighted text we will paraphrase
          or remove it.
        </p>
      </DocsSection>

      <DocsSection title="Wiki attribution">
        <p>
          Where a fact originates from the{" "}
          <a
            href="https://hollowknight.fandom.com/"
            target="_blank"
            rel="noreferrer noopener"
            className="underline-offset-4 hover:underline"
          >
            Hollow Knight Wiki
          </a>{" "}
          or another community wiki, we cite the page in{" "}
          <code className="font-mono">sources</code>. Wiki content is licensed under{" "}
          <a
            href="https://creativecommons.org/licenses/by-sa/3.0/"
            target="_blank"
            rel="noreferrer noopener"
            className="underline-offset-4 hover:underline"
          >
            CC BY-SA 3.0
          </a>
          .
        </p>
      </DocsSection>

      <DocsSection title="No monetization of Team Cherry’s IP">
        <p>
          Team Cherry’s fan-content policy disallows crowdfunding tied to their IP. We
          honor that — HallownestAPI is free, has no paid tier, and never will. Hosting
          and maintenance are covered by sponsors of the maintainers’ open-source work,
          not by selling access to this data.
        </p>
      </DocsSection>

      <DocsSection title="Takedown">
        <p>
          If you represent Team Cherry and want anything changed or removed, open an issue
          on GitHub or email the maintainer. We will respond promptly.
        </p>
      </DocsSection>
    </DocsPage>
  );
}
