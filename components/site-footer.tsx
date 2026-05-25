import Link from "next/link";

import { HollowMark } from "@/components/hollow-mark";
import { siteConfig } from "@/lib/site-config";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm";

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
            <span className="font-semibold tracking-tight" translate="no">
              HallownestAPI
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            An open, structured data API for the Hollow Knight games. Free, fan-made,
            non-commercial.
          </p>
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
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
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
