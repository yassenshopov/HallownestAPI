/**
 * Single source of truth for site identity / SEO. Read by `app/layout.tsx`,
 * `sitemap.ts`, `robots.ts`, `manifest.ts`, structured-data helpers, and any
 * per-page metadata override that needs an absolute URL.
 */

export const siteConfig = {
  name: "HallownestAPI",
  shortName: "HallownestAPI",
  /**
   * Hard-coded production hostname. Overridden by `NEXT_PUBLIC_SITE_URL` so
   * preview deploys and local dev get correct absolute URLs without forcing
   * `https://hallownestapi.dev` into Open Graph cards.
   */
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://hallownestapi.dev"
  ).replace(/\/+$/, ""),
  title: "HallownestAPI — open API for Hollow Knight & Silksong",
  titleTemplate: "%s · HallownestAPI",
  description:
    "A free, open-source REST API for Hollow Knight and Silksong data — bosses, charms, areas, characters, and skills. Fan-made, non-commercial, modelled on PokeAPI.",
  shortDescription:
    "A free, open-source REST API for Hollow Knight and Silksong data.",
  /**
   * Default Open Graph image — Next.js will pick up `app/opengraph-image.tsx`
   * automatically for the root, but having an absolute URL on hand lets us
   * inject it into JSON-LD where the file-based convention does not reach.
   */
  ogImagePath: "/opengraph-image",
  locale: "en_US",
  language: "en",
  themeColor: {
    // Roughly the rendered values of `--background` in `app/globals.css` — keep
    // these in sync so the mobile browser chrome blends into the Atmosphere
    // backdrop instead of cutting a hard line at the top of the page.
    light: "#f7f9fb",
    dark: "#0b1018",
  },
  /**
   * Author / publisher labels. The project has no single individual author —
   * present it as a community organization to keep schema.org consumers happy.
   */
  author: {
    name: "HallownestAPI Contributors",
    url: "https://github.com/yassencrosby/hollowapi",
  },
  social: {
    github: "https://github.com/yassencrosby/hollowapi",
  },
  /**
   * Default SEO keyword pool. Per-entity pages should extend this with their
   * own slug + tag list rather than replace it.
   */
  keywords: [
    "Hollow Knight",
    "Hollow Knight Silksong",
    "Silksong",
    "Hallownest",
    "HallownestAPI",
    "Hollow Knight API",
    "Silksong API",
    "Hollow Knight bosses",
    "Hollow Knight charms",
    "Hollow Knight areas",
    "Hollow Knight characters",
    "Team Cherry",
    "PokeAPI",
    "open data",
    "fan project",
    "REST API",
    "JSON API",
  ],
} as const;

export type SiteConfig = typeof siteConfig;

/** Resolve a path against `siteConfig.url`, guaranteeing a clean absolute URL. */
export function absoluteUrl(path: string = "/"): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${siteConfig.url}${path}`;
}
