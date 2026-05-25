#!/usr/bin/env node
/**
 * Fetches image URLs and canonical page URLs for every boss from the
 * Hollow Knight Fandom wiki MediaWiki API, then writes a JSON cache
 * at data/wiki-cache.json.
 *
 * Run: node scripts/fetch-wiki.mjs
 *
 * The script never stores binary images. It only stores public URLs
 * that the wiki itself serves, and reuses them via next/image at runtime.
 * Per the Fandom CC BY-SA 3.0 license, attribution is preserved in the
 * data via the wikiUrl field.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "data", "wiki-cache.json");

const API = "https://hollowknight.fandom.com/api.php";
const WIKI_BASE = "https://hollowknight.fandom.com/wiki/";

/** Read every boss data file and pull out (slug, wikiSlug) pairs. */
async function collectBossTargets() {
  const indexPath = resolve(ROOT, "data", "bosses", "index.ts");
  const src = await readFile(indexPath, "utf8");
  const importMatches = [
    ...src.matchAll(/import\s+\w+\s+from\s+"\.\/([\w-]+)";/g),
  ];

  const targets = [];
  for (const m of importMatches) {
    const slug = m[1];
    const file = await readFile(
      resolve(ROOT, "data", "bosses", `${slug}.ts`),
      "utf8",
    );
    const wikiMatch = file.match(/wikiSlug:\s*"([^"]+)"/);
    if (wikiMatch) {
      targets.push({ slug, wikiSlug: wikiMatch[1] });
    }
  }
  return targets;
}

async function queryWiki(titles) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    prop: "pageimages|info",
    inprop: "url",
    piprop: "original",
    titles: titles.join("|"),
    redirects: "1",
    origin: "*",
  });

  const res = await fetch(`${API}?${params.toString()}`, {
    headers: {
      "user-agent":
        "HallownestAPI/0.1 (+https://github.com/yassenshopov/HallownestAPI)",
    },
  });
  if (!res.ok) {
    throw new Error(`MediaWiki API ${res.status}: ${await res.text()}`);
  }
  const json = await res.json();
  return json.query;
}

/** Map redirected titles back to the slugs we originally asked about. */
function buildResolver(query) {
  const map = new Map();
  const redirects = query?.redirects ?? [];
  for (const r of redirects) map.set(r.from, r.to);
  const normalized = query?.normalized ?? [];
  for (const n of normalized) map.set(n.from, n.to);
  return (title) => {
    let current = title;
    let hops = 0;
    while (map.has(current) && hops++ < 5) current = map.get(current);
    return current;
  };
}

async function main() {
  const targets = await collectBossTargets();
  console.log(`[wiki] ${targets.length} bosses with wikiSlug`);

  const cache = {};
  const batchSize = 25;
  for (let i = 0; i < targets.length; i += batchSize) {
    const batch = targets.slice(i, i + batchSize);
    const titles = batch.map((t) => t.wikiSlug);
    process.stdout.write(`[wiki] fetching ${i + 1}-${i + batch.length}… `);

    try {
      const query = await queryWiki(titles);
      const pages = query?.pages ?? {};
      const resolve = buildResolver(query);

      for (const t of batch) {
        const finalTitle = resolve(t.wikiSlug);
        const page = Object.values(pages).find(
          (p) => p.title === finalTitle || p.title === t.wikiSlug,
        );

        const entry = {
          wikiSlug: t.wikiSlug,
          wikiUrl: page?.fullurl ?? `${WIKI_BASE}${encodeURI(t.wikiSlug)}`,
        };
        if (page?.original?.source) {
          entry.image = {
            url: page.original.source,
            width: page.original.width,
            height: page.original.height,
            attribution: `Hollow Knight Wiki — ${page.title}`,
            license: "CC BY-SA 3.0",
          };
        }
        cache[t.slug] = entry;
      }
      process.stdout.write("ok\n");
    } catch (e) {
      process.stdout.write(`fail (${String(e?.message ?? e)})\n`);
    }

    await new Promise((r) => setTimeout(r, 350));
  }

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(cache, null, 2) + "\n", "utf8");

  const hit = Object.values(cache).filter((v) => v.image?.url).length;
  console.log(
    `[wiki] wrote ${OUT}: ${Object.keys(cache).length} entries (${hit} with images)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
