import type { Metadata } from "next";

import { absoluteUrl, siteConfig } from "@/lib/site";

/**
 * Build the per-page metadata block. Centralised so every page renders the
 * same OG / Twitter / canonical surface — only the strings change.
 *
 * Pass `path` (e.g. `/bosses/false-knight`) so canonical + OG URLs always
 * point at the absolute production URL.
 */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
  noIndex = false,
  ogImage,
}: {
  title?: string;
  description?: string;
  path: string;
  keywords?: readonly string[] | string[];
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
  ogImage?: string;
}): Metadata {
  const canonical = absoluteUrl(path);
  const resolvedTitle = title ?? siteConfig.title;
  const resolvedDescription = description ?? siteConfig.description;
  const resolvedImage = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : absoluteUrl(ogImage)
    : undefined;

  return {
    title,
    description: resolvedDescription,
    keywords:
      keywords && keywords.length > 0
        ? [...siteConfig.keywords, ...keywords]
        : undefined,
    alternates: {
      canonical,
    },
    openGraph: {
      type,
      url: canonical,
      siteName: siteConfig.name,
      title: resolvedTitle,
      description: resolvedDescription,
      locale: siteConfig.locale,
      ...(resolvedImage ? { images: [{ url: resolvedImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      ...(resolvedImage ? { images: [resolvedImage] } : {}),
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

/**
 * Generic helper for embedding a JSON-LD blob. Page components render this
 * inline via `<script type="application/ld+json">` so crawlers can pick it up
 * server-side.
 */
export function jsonLdScript(data: Record<string, unknown>): string {
  // Escape `</` to prevent breaking out of the <script> tag if any field ever
  // contains user-provided HTML (it shouldn't, but defence-in-depth).
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

// -----------------------------------------------------------------------------
// Schema.org builders
// -----------------------------------------------------------------------------

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/icon"),
    sameAs: [siteConfig.social.github],
    description: siteConfig.description,
  } as const;
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: { "@id": `${siteConfig.url}/#organization` },
  } as const;
}

/**
 * Cross-game video game reference. Used as the `about` / `isPartOf` target for
 * every entity page so search engines can group everything under a real
 * VideoGame entity rather than a flat blob of pages.
 */
export function videoGameLd(game: "hk" | "silksong") {
  if (game === "silksong") {
    return {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      name: "Hollow Knight: Silksong",
      alternateName: ["Silksong"],
      publisher: "Team Cherry",
      developer: "Team Cherry",
      gamePlatform: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
      genre: ["Metroidvania", "Action-adventure"],
      url: "https://www.hollowknightsilksong.com",
    } as const;
  }
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Hollow Knight",
    publisher: "Team Cherry",
    developer: "Team Cherry",
    gamePlatform: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
    genre: ["Metroidvania", "Action-adventure"],
    url: "https://www.hollowknight.com",
    datePublished: "2017-02-24",
  } as const;
}

export type BreadcrumbCrumb = { name: string; path: string };

export function breadcrumbLd(crumbs: BreadcrumbCrumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  } as const;
}

/**
 * Generic "thing in a video game" entity — used for bosses, charms, skills,
 * characters, areas. Search engines don't have first-class game-content types
 * (apart from `VideoGame` itself), so we lean on `Thing` + `about` to anchor
 * the entry to its parent game.
 */
export function gameEntityLd({
  type,
  name,
  description,
  path,
  game,
  image,
  sameAs,
}: {
  type: "Thing" | "Place" | "Person";
  name: string;
  description?: string;
  path: string;
  game: "hk" | "silksong";
  image?: string;
  sameAs?: string[];
}) {
  const resolvedImage = image
    ? image.startsWith("http")
      ? image
      : absoluteUrl(image)
    : absoluteUrl("/opengraph-image");

  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url: absoluteUrl(path),
    image: resolvedImage,
    inLanguage: siteConfig.language,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: videoGameLd(game),
    ...(sameAs && sameAs.length > 0 ? { sameAs } : {}),
  } as const;
}

/**
 * `CollectionPage` JSON-LD for the index pages. Embeds an `ItemList` of up
 * to N children so Google can surface them as sitelinks under the parent.
 */
export function collectionPageLd({
  name,
  description,
  path,
  items,
  itemBasePath,
}: {
  name: string;
  description: string;
  path: string;
  items: { slug: string; name: string }[];
  itemBasePath: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    inLanguage: siteConfig.language,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.slice(0, 30).map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: absoluteUrl(`${itemBasePath}/${item.slug}`),
      })),
    },
  } as const;
}

/** API endpoint schema for the docs index. */
export function apiReferenceLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebAPI",
    name: `${siteConfig.name} REST API`,
    description: siteConfig.description,
    documentation: absoluteUrl("/docs"),
    provider: { "@id": `${siteConfig.url}/#organization` },
    termsOfService: absoluteUrl("/docs/legal"),
  } as const;
}
