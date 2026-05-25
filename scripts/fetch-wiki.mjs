#!/usr/bin/env node
/**
 * Fetches image URLs and canonical page URLs for every boss from the
 * Hollow Knight Fandom wiki MediaWiki API, then writes a JSON cache
 * at data/wiki-cache.json.
 *
 * Run: node scripts/fetch-wiki.mjs
 *
 * Strategy:
 *  1. Hit `pageimages` to get a candidate image URL per page.
 *  2. Also build a `Special:FilePath/<filename>` URL — that redirect always
 *     resolves to the current revision and survives renames.
 *  3. HEAD each candidate. If the response is non-200 OR the content-length
 *     is below 5 KB (Fandom's "missing file" stub is ~2 KB), fall back to
 *     the Special:FilePath URL. If that also fails, drop the image entry
 *     entirely so the UI shows a placeholder instead of a broken thumbnail.
 *
 * The script never stores binary images. It only stores public URLs that the
 * wiki itself serves, and reuses them via next/image at runtime. Per the
 * Fandom CC BY-SA 3.0 license, attribution is preserved in the data via the
 * wikiUrl field.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "data", "wiki-cache.json");

const API = "https://hollowknight.fandom.com/api.php";
const WIKI_BASE = "https://hollowknight.fandom.com/wiki/";
const FILE_PATH_BASE = "https://hollowknight.fandom.com/wiki/Special:FilePath/";

const USER_AGENT =
  "HallownestAPI/0.1 (+https://github.com/yassenshopov/HallownestAPI)";

/** Minimum acceptable image size; Fandom's missing-file stub is ~2 KB. */
const MIN_IMAGE_BYTES = 5000;
/** Polite spacing between HEAD requests. */
const HEAD_DELAY_MS = 250;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

/**
 * Extract the filename from a Fandom CDN URL like
 *   https://static.wikia.nocookie.net/hollowknight/images/a/ab/Foo.png/revision/latest/...
 * The filename is the segment between `/images/<hex>/<hex>/` and `/revision/`.
 */
function extractFandomFilename(url) {
  if (!url) return null;
  const m = url.match(/\/images\/[^/]+\/[^/]+\/([^/?]+)(?:\/revision\/|\?|$)/);
  return m ? decodeURIComponent(m[1]) : null;
}

/**
 * HEAD an image URL and decide whether it's usable.
 * Returns the (possibly redirected) URL string if usable, otherwise null.
 */
async function probeImage(url) {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "user-agent": USER_AGENT },
    });
    if (!res.ok) return null;
    const length = Number(res.headers.get("content-length") ?? 0);
    // Some Fandom thumb URLs don't advertise content-length on HEAD; accept
    // those (length === 0) since they will at least return a real image body.
    if (length > 0 && length < MIN_IMAGE_BYTES) return null;
    return res.url || url;
  } catch {
    return null;
  }
}

async function main() {
  const targets = await collectBossTargets();
  console.log(`[wiki] ${targets.length} bosses with wikiSlug`);

  // 1) Bulk query MediaWiki for metadata.
  const meta = new Map();
  const batchSize = 25;
  for (let i = 0; i < targets.length; i += batchSize) {
    const batch = targets.slice(i, i + batchSize);
    const titles = batch.map((t) => t.wikiSlug);
    process.stdout.write(`[wiki] querying ${i + 1}-${i + batch.length}… `);
    try {
      const query = await queryWiki(titles);
      const pages = query?.pages ?? {};
      const resolveTitle = buildResolver(query);
      for (const t of batch) {
        const finalTitle = resolveTitle(t.wikiSlug);
        const page = Object.values(pages).find(
          (p) => p.title === finalTitle || p.title === t.wikiSlug,
        );
        meta.set(t.slug, { target: t, page });
      }
      process.stdout.write("ok\n");
    } catch (e) {
      process.stdout.write(`fail (${String(e?.message ?? e)})\n`);
      for (const t of batch) meta.set(t.slug, { target: t, page: null });
    }
    await sleep(350);
  }

  // 2) Validate image URLs with HEAD requests.
  const cache = {};
  let i = 0;
  for (const [slug, { target, page }] of meta) {
    i++;
    const entry = {
      wikiSlug: target.wikiSlug,
      wikiUrl: page?.fullurl ?? `${WIKI_BASE}${encodeURI(target.wikiSlug)}`,
    };

    const primary = page?.original?.source ?? null;
    const filename = extractFandomFilename(primary);
    const fallback = filename
      ? `${FILE_PATH_BASE}${encodeURIComponent(filename)}`
      : null;

    let chosen = null;
    let via = "none";
    if (primary) {
      const ok = await probeImage(primary);
      if (ok) {
        chosen = primary;
        via = "primary";
      }
      await sleep(HEAD_DELAY_MS);
    }
    if (!chosen && fallback) {
      const ok = await probeImage(fallback);
      if (ok) {
        chosen = fallback;
        via = "filepath";
      }
      await sleep(HEAD_DELAY_MS);
    }

    if (chosen) {
      entry.image = {
        url: chosen,
        width: page?.original?.width,
        height: page?.original?.height,
        attribution: `Hollow Knight Wiki — ${page?.title ?? target.wikiSlug}`,
        license: "CC BY-SA 3.0",
      };
    }

    cache[slug] = entry;
    process.stdout.write(
      `[wiki] (${i}/${meta.size}) ${slug} → ${via}${chosen ? "" : " (no image)"}\n`,
    );
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
