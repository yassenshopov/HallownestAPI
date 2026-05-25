#!/usr/bin/env node
/**
 * Fetches canonical Fandom wiki URLs for every entity that declares a
 * `wikiSlug`, and writes the results to `data/wiki-cache.json`.
 *
 *   node scripts/fetch-wiki.mjs                  # all namespaces
 *   node scripts/fetch-wiki.mjs bosses areas     # subset
 *
 * Output shape:
 *   {
 *     "bosses":     { "<slug>": { wikiSlug, wikiUrl } },
 *     "areas":      { "<slug>": { ... } },
 *     "skills":     { "<slug>": { ... } },
 *     "charms":     { "<slug>": { ... } },
 *     "characters": { "<slug>": { ... } }
 *   }
 *
 * The script only stores public wiki URLs. It does NOT mirror any wiki
 * content. Per the Fandom CC BY-SA 3.0 license, attribution is preserved
 * via the `wikiUrl` field rendered in the "Sources" sidebar.
 */

import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "data", "wiki-cache.json");

const API = "https://hollowknight.fandom.com/api.php";
const WIKI_BASE = "https://hollowknight.fandom.com/wiki/";

const USER_AGENT =
  "HallownestAPI/0.1 (+https://github.com/yassenshopov/HallownestAPI)";

/** Map from entity namespace → folder under data/. */
const NAMESPACES = {
  bosses: "bosses",
  areas: "areas",
  skills: "skills",
  charms: "charms",
  characters: "characters",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** List every `<slug>.ts` file in `data/<folder>/`, except the index. */
async function listEntityFiles(folder) {
  const dir = resolve(ROOT, "data", folder);
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter(
      (e) => e.isFile() && e.name.endsWith(".ts") && e.name !== "index.ts",
    )
    .map((e) => e.name.replace(/\.ts$/, ""));
}

async function readWikiSlug(folder, slug) {
  const file = join(ROOT, "data", folder, `${slug}.ts`);
  const src = await readFile(file, "utf8");
  const m = src.match(/wikiSlug:\s*"([^"]+)"/);
  return m ? m[1] : null;
}

/** Read every entity file in a namespace and return [{ slug, wikiSlug }]. */
async function collectTargets(folder) {
  const slugs = await listEntityFiles(folder);
  const out = [];
  for (const slug of slugs) {
    const wikiSlug = await readWikiSlug(folder, slug);
    if (wikiSlug) out.push({ slug, wikiSlug });
  }
  return out;
}

async function queryWiki(titles) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    prop: "info",
    inprop: "url",
    titles: titles.join("|"),
    redirects: "1",
    origin: "*",
  });

  const res = await fetch(`${API}?${params.toString()}`, {
    headers: { "user-agent": USER_AGENT },
  });
  if (!res.ok) {
    throw new Error(`MediaWiki API ${res.status}: ${await res.text()}`);
  }
  const json = await res.json();
  return json.query;
}

/** Map redirected / normalized titles back to the originals. */
function buildResolver(query) {
  const map = new Map();
  for (const r of query?.redirects ?? []) map.set(r.from, r.to);
  for (const n of query?.normalized ?? []) map.set(n.from, n.to);
  return (title) => {
    let current = title;
    let hops = 0;
    while (map.has(current) && hops++ < 5) current = map.get(current);
    return current;
  };
}

async function enrichNamespace(folder, label) {
  const targets = await collectTargets(folder);
  console.log(`[wiki:${label}] ${targets.length} entities with wikiSlug`);

  const cache = {};
  const batchSize = 25;
  for (let i = 0; i < targets.length; i += batchSize) {
    const batch = targets.slice(i, i + batchSize);
    const titles = batch.map((t) => t.wikiSlug);
    process.stdout.write(
      `[wiki:${label}] querying ${i + 1}-${i + batch.length}… `,
    );
    try {
      const query = await queryWiki(titles);
      const pages = query?.pages ?? {};
      const resolveTitle = buildResolver(query);
      for (const t of batch) {
        const finalTitle = resolveTitle(t.wikiSlug);
        const page = Object.values(pages).find(
          (p) => p.title === finalTitle || p.title === t.wikiSlug,
        );
        cache[t.slug] = {
          wikiSlug: t.wikiSlug,
          wikiUrl: page?.fullurl ?? `${WIKI_BASE}${encodeURI(t.wikiSlug)}`,
        };
      }
      process.stdout.write("ok\n");
    } catch (e) {
      process.stdout.write(`fail (${String(e?.message ?? e)})\n`);
      for (const t of batch) {
        cache[t.slug] = {
          wikiSlug: t.wikiSlug,
          wikiUrl: `${WIKI_BASE}${encodeURI(t.wikiSlug)}`,
        };
      }
    }
    await sleep(350);
  }

  return cache;
}

async function readExistingCache() {
  try {
    const raw = await readFile(OUT, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function main() {
  const requested = process.argv.slice(2);
  const namespaces =
    requested.length > 0
      ? requested.filter((n) => Object.hasOwn(NAMESPACES, n))
      : Object.keys(NAMESPACES);

  if (namespaces.length === 0) {
    console.error(
      `[wiki] unknown namespace(s) "${requested.join(", ")}". ` +
        `Valid: ${Object.keys(NAMESPACES).join(", ")}`,
    );
    process.exit(1);
  }

  // Preserve any existing namespace data so a partial run doesn't drop sibling
  // caches (e.g. `node fetch-wiki.mjs charms` should keep `bosses` untouched).
  const cache = await readExistingCache();
  for (const ns of Object.keys(NAMESPACES)) {
    if (!cache[ns]) cache[ns] = {};
  }

  for (const ns of namespaces) {
    const folder = NAMESPACES[ns];
    cache[ns] = await enrichNamespace(folder, ns);
  }

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(cache, null, 2) + "\n", "utf8");

  const summary = namespaces.map((ns) => {
    const entries = cache[ns] ?? {};
    return `${ns}: ${Object.keys(entries).length}`;
  });
  console.log(`[wiki] wrote ${OUT}\n[wiki] ${summary.join(" · ")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
