import Link from "next/link";
import { Coffee } from "lucide-react";

import { HollowMark } from "@/components/hollow-mark";
import { siteConfig } from "@/lib/site-config";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm";

// Inline brand SVGs — `lucide-react` removed Github/Linkedin (and other brand
// glyphs) over trademark concerns, so we ship our own. Same pattern as the
// `GithubIcon` already inlined in `site-header.tsx`.
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

const authorSocials = [
  {
    href: siteConfig.author.githubUrl,
    label: `${siteConfig.author.name} on GitHub`,
    Icon: GithubIcon,
  },
  {
    href: siteConfig.author.linkedinUrl,
    label: `${siteConfig.author.name} on LinkedIn`,
    Icon: LinkedinIcon,
  },
  {
    href: siteConfig.buyMeACoffeeUrl,
    label: `Buy ${siteConfig.author.name} a coffee`,
    Icon: Coffee,
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-2">
          <Link
            href="/"
            className={`flex items-center gap-2 rounded-md ${FOCUS_RING}`}
            aria-label="HallownestAPI home"
          >
            <HollowMark className="h-5 w-5 text-primary" />
            <span
              className="font-heading font-semibold tracking-tight"
              translate="no"
            >
              HallownestAPI
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            An open, structured data API for the Hollow Knight games. Free, fan-made,
            non-commercial.
          </p>
          {/* Author socials — small icon row keeps the column compact while
              still surfacing the maintainer's personal links + tip jar. */}
          <ul className="flex items-center gap-1 pt-1">
            {authorSocials.map(({ href, label, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground ${FOCUS_RING}`}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <FooterColumn
          title="Explore"
          links={[
            { href: "/bosses", label: "Bosses" },
            { href: "/docs", label: "Documentation" },
            { href: "/api/v1", label: "API root" },
          ]}
        />
        <FooterColumn
          title="Project"
          links={[
            { href: siteConfig.githubUrl, label: "GitHub", external: true },
            { href: "/docs/contributing", label: "Contributing" },
            {
              href: siteConfig.buyMeACoffeeUrl,
              label: "Buy me a coffee",
              external: true,
            },
            { href: "/docs/legal", label: "Legal & attribution" },
          ]}
        />
        <FooterColumn
          title="Community"
          links={[
            {
              href: "https://www.teamcherry.com.au/",
              label: "Team Cherry",
              external: true,
            },
            {
              href: "https://hollowknight.fandom.com/",
              label: "HK Wiki",
              external: true,
            },
            {
              href: "https://github.com/hk-modding/api",
              label: "Modding API",
              external: true,
            },
          ]}
        />
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p>
            <span translate="no">Hollow Knight</span> and{" "}
            <span translate="no">Silksong</span> are trademarks of{" "}
            <span translate="no">Team Cherry</span>.{" "}
            <span translate="no">HallownestAPI</span> is a fan-made project and is not
            affiliated with or endorsed by <span translate="no">Team Cherry</span>.
          </p>
          <p>
            © {new Date().getFullYear()}{" "}
            <span translate="no">HallownestAPI</span> contributors.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
}) {
  return (
    <div>
      <h3 className="mb-3 font-heading text-xs font-semibold uppercase tracking-wider text-foreground">
        {title}
      </h3>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              className={`text-muted-foreground transition-colors hover:text-foreground ${FOCUS_RING}`}
              {...(l.external
                ? { target: "_blank", rel: "noreferrer noopener" }
                : {})}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
