import type { MetadataRoute } from "next";

import { areas, bosses, characters, charms, skills } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];

// Lightweight default — every entry in the registry gets the same shape unless
// it has an `updatedAt` we can surface to crawlers.
function entry({
  path,
  updatedAt,
  priority,
  changeFrequency,
}: {
  path: string;
  updatedAt?: string;
  priority: number;
  changeFrequency: Entry["changeFrequency"];
}): Entry {
  return {
    url: absoluteUrl(path),
    lastModified: updatedAt ? new Date(updatedAt) : new Date(),
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: Entry[] = [
    entry({ path: "/", priority: 1.0, changeFrequency: "weekly" }),
    entry({ path: "/bosses", priority: 0.9, changeFrequency: "weekly" }),
    entry({ path: "/characters", priority: 0.9, changeFrequency: "weekly" }),
    entry({ path: "/areas", priority: 0.9, changeFrequency: "weekly" }),
    entry({ path: "/charms", priority: 0.9, changeFrequency: "weekly" }),
    entry({ path: "/skills", priority: 0.9, changeFrequency: "weekly" }),
    entry({ path: "/docs", priority: 0.8, changeFrequency: "monthly" }),
    entry({ path: "/docs/quickstart", priority: 0.7, changeFrequency: "monthly" }),
    entry({ path: "/docs/endpoints", priority: 0.7, changeFrequency: "monthly" }),
    entry({ path: "/docs/schema", priority: 0.7, changeFrequency: "monthly" }),
    entry({ path: "/docs/contributing", priority: 0.5, changeFrequency: "monthly" }),
    entry({ path: "/docs/legal", priority: 0.3, changeFrequency: "yearly" }),
  ];

  const bossPages: Entry[] = bosses.map((b) =>
    entry({
      path: `/bosses/${b.slug}`,
      updatedAt: b.updatedAt,
      priority: 0.8,
      changeFrequency: "monthly",
    }),
  );

  const characterPages: Entry[] = characters.map((c) =>
    entry({
      path: `/characters/${c.slug}`,
      updatedAt: c.updatedAt,
      priority: 0.7,
      changeFrequency: "monthly",
    }),
  );

  const areaPages: Entry[] = areas.map((a) =>
    entry({
      path: `/areas/${a.slug}`,
      updatedAt: a.updatedAt,
      priority: 0.7,
      changeFrequency: "monthly",
    }),
  );

  const charmPages: Entry[] = charms.map((c) =>
    entry({
      path: `/charms/${c.slug}`,
      updatedAt: c.updatedAt,
      priority: 0.7,
      changeFrequency: "monthly",
    }),
  );

  const skillPages: Entry[] = skills.map((s) =>
    entry({
      path: `/skills/${s.slug}`,
      updatedAt: s.updatedAt,
      priority: 0.7,
      changeFrequency: "monthly",
    }),
  );

  return [
    ...staticPages,
    ...bossPages,
    ...characterPages,
    ...areaPages,
    ...charmPages,
    ...skillPages,
  ];
}
