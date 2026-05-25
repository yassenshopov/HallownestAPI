"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CornerDownLeft,
  Gem,
  MapPin,
  Search,
  Skull,
  Sparkles,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Lightweight, serializable shape sent from the (server) homepage into the
 * client search component. We deliberately do NOT send full entity payloads
 * — just enough to render a row and a link target.
 */
export type SearchItemType = "boss" | "character" | "area" | "charm" | "skill";

export type SearchItem = {
  type: SearchItemType;
  slug: string;
  name: string;
  href: string;
  /** Secondary line in the row (area name, charm effect, character role…). */
  sub?: string;
  /** Used for the small HK / SS chip on each row. */
  game: "hk" | "silksong";
};

type TypeMeta = {
  label: string;
  plural: string;
  href: string;
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

const TYPE_META: Record<SearchItemType, TypeMeta> = {
  boss: { label: "Boss", plural: "Bosses", href: "/bosses", Icon: Skull },
  character: {
    label: "Character",
    plural: "Characters",
    href: "/characters",
    Icon: User,
  },
  area: { label: "Area", plural: "Areas", href: "/areas", Icon: MapPin },
  charm: { label: "Charm", plural: "Charms", href: "/charms", Icon: Gem },
  skill: { label: "Skill", plural: "Skills", href: "/skills", Icon: Sparkles },
};

const TYPE_ORDER: SearchItemType[] = [
  "boss",
  "character",
  "area",
  "charm",
  "skill",
];

const MAX_PER_GROUP = 5;
const MAX_TOTAL = 40;

/**
 * Lower is better. We bias by how the query lines up against the name first,
 * then slug, then the secondary line — so typing "false" lands on
 * "False Knight" instead of, say, a charm whose effect mentions "false".
 */
function rank(item: SearchItem, q: string): number {
  const name = item.name.toLowerCase();
  if (name === q) return 0;
  if (name.startsWith(q)) return 1;
  if (name.split(/\s+/).some((w) => w.startsWith(q))) return 2;
  if (name.includes(q)) return 3;
  if (item.slug.includes(q)) return 4;
  if (item.sub?.toLowerCase().includes(q)) return 5;
  return Number.POSITIVE_INFINITY;
}

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-primary/15 px-0.5 text-primary">
        {text.slice(i, i + q.length)}
      </mark>
      {text.slice(i + q.length)}
    </>
  );
}

export function GlobalSearch({ items }: { items: SearchItem[] }) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listboxId = React.useId();

  const q = query.trim().toLowerCase();

  const grouped = React.useMemo(() => {
    if (!q) return [] as Array<readonly [SearchItemType, SearchItem[]]>;

    const scored: Array<{ item: SearchItem; r: number }> = [];
    for (const item of items) {
      const r = rank(item, q);
      if (Number.isFinite(r)) scored.push({ item, r });
    }
    scored.sort(
      (a, b) => a.r - b.r || a.item.name.localeCompare(b.item.name),
    );

    const map = new Map<SearchItemType, SearchItem[]>();
    let total = 0;
    for (const { item } of scored) {
      if (total >= MAX_TOTAL) break;
      const bucket = map.get(item.type) ?? [];
      if (bucket.length >= MAX_PER_GROUP) continue;
      bucket.push(item);
      map.set(item.type, bucket);
      total += 1;
    }

    return TYPE_ORDER.flatMap((t) => {
      const arr = map.get(t);
      return arr && arr.length > 0 ? [[t, arr] as const] : [];
    });
  }, [items, q]);

  // Flat list mirrors render order; drives keyboard navigation + indexing.
  const flat = React.useMemo(
    () => grouped.flatMap(([, arr]) => arr),
    [grouped],
  );

  // Reset active row whenever the query (and therefore the result set) shifts.
  React.useEffect(() => {
    setActiveIndex(0);
  }, [q]);

  // Click-outside + global ⌘K / Ctrl+K shortcut.
  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      const cmdK =
        (e.metaKey || e.ctrlKey) &&
        !e.shiftKey &&
        !e.altKey &&
        e.key.toLowerCase() === "k";
      if (cmdK) {
        e.preventDefault();
        const el = inputRef.current;
        if (el) {
          el.focus();
          el.select();
        }
        setOpen(true);
        return;
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Keep the active row in view when arrowing past the panel's clip.
  React.useEffect(() => {
    if (!open) return;
    const el = document.getElementById(`${listboxId}-opt-${activeIndex}`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open, listboxId]);

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      if (flat.length === 0) return;
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => (i + 1) % flat.length);
    } else if (e.key === "ArrowUp") {
      if (flat.length === 0) return;
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => (i - 1 + flat.length) % flat.length);
    } else if (e.key === "Enter") {
      const hit = flat[activeIndex];
      if (!hit) return;
      e.preventDefault();
      setOpen(false);
      router.push(hit.href);
    }
  }

  const activeId =
    open && flat.length > 0 ? `${listboxId}-opt-${activeIndex}` : undefined;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-2xl"
      role="search"
    >
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onInputKey}
          placeholder="Search bosses, charms, areas, characters, skills…"
          aria-label="Search HallownestAPI"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={activeId}
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="go"
          className="block h-14 w-full rounded-xl border border-border/60 bg-card/70 pl-12 pr-24 text-base shadow-sm backdrop-blur transition-colors placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-16 sm:pr-28 sm:text-lg"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 select-none items-center gap-1 rounded-md border border-border/70 bg-muted/60 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:inline-flex">
          <span aria-hidden="true">⌘</span>
          <span>K</span>
        </kbd>
      </div>

      {open ? (
        <div
          // The listbox panel: floats below the input, scrolls internally when
          // results overflow, dismisses on click-outside / Escape.
          className="absolute inset-x-0 top-full z-40 mt-2 max-h-[min(70vh,32rem)] overflow-y-auto rounded-xl border border-border/60 bg-popover/95 text-popover-foreground shadow-xl ring-1 ring-foreground/5 backdrop-blur"
        >
          {q.length === 0 ? (
            <EmptyState />
          ) : flat.length === 0 ? (
            <NoResults query={query} />
          ) : (
            <ul
              id={listboxId}
              role="listbox"
              aria-label="Search results"
              className="py-1"
            >
              {grouped.map(([type, arr]) => {
                const meta = TYPE_META[type];
                return (
                  <li key={type} role="presentation" className="py-1">
                    <div className="flex items-center justify-between px-3 pb-1 pt-2">
                      <span className="font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        {meta.plural}
                      </span>
                      <Link
                        href={meta.href}
                        onClick={() => setOpen(false)}
                        className="text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Browse all →
                      </Link>
                    </div>
                    <ul role="presentation">
                      {arr.map((item) => {
                        const flatIndex = flat.indexOf(item);
                        const active = flatIndex === activeIndex;
                        const Icon = meta.Icon;
                        return (
                          <li
                            key={`${item.type}:${item.slug}`}
                            id={`${listboxId}-opt-${flatIndex}`}
                            role="option"
                            aria-selected={active}
                          >
                            <Link
                              href={item.href}
                              onMouseEnter={() => setActiveIndex(flatIndex)}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm outline-none transition-colors",
                                active
                                  ? "bg-accent text-accent-foreground"
                                  : "text-foreground hover:bg-accent/60",
                              )}
                            >
                              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/60 text-muted-foreground">
                                <Icon
                                  aria-hidden={true}
                                  className="h-3.5 w-3.5"
                                />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate font-medium">
                                  <Highlight
                                    text={item.name}
                                    query={query}
                                  />
                                </span>
                                {item.sub ? (
                                  <span className="block truncate text-xs text-muted-foreground">
                                    {item.sub}
                                  </span>
                                ) : null}
                              </span>
                              <span
                                className="hidden shrink-0 rounded border border-border/60 bg-background/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:inline-block"
                                aria-label={
                                  item.game === "hk"
                                    ? "Hollow Knight"
                                    : "Silksong"
                                }
                              >
                                {item.game === "hk" ? "HK" : "SS"}
                              </span>
                              <CornerDownLeft
                                aria-hidden={true}
                                className={cn(
                                  "hidden h-3.5 w-3.5 shrink-0 text-muted-foreground sm:inline-block",
                                  active ? "opacity-100" : "opacity-0",
                                )}
                              />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <ShortcutHint keys={["↑", "↓"]} label="navigate" />
              <ShortcutHint keys={["↵"]} label="open" />
              <ShortcutHint keys={["esc"]} label="close" />
            </div>
            <span className="hidden sm:inline">
              {flat.length > 0
                ? `${flat.length} result${flat.length === 1 ? "" : "s"}`
                : null}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="p-3">
      <p className="px-1 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        Jump to a section
      </p>
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-5">
        {TYPE_ORDER.map((t) => {
          const meta = TYPE_META[t];
          const Icon = meta.Icon;
          return (
            <Link
              key={t}
              href={meta.href}
              className="flex flex-col items-center gap-1.5 rounded-md border border-border/60 bg-card/40 px-2 py-3 text-xs text-foreground/80 transition-colors hover:border-primary/40 hover:bg-card hover:text-foreground"
            >
              <Icon aria-hidden={true} className="h-4 w-4 text-primary/80" />
              {meta.plural}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="px-4 py-10 text-center">
      <p className="font-heading text-sm text-foreground">
        No matches for{" "}
        <span className="font-mono text-foreground">
          &ldquo;{query.trim()}&rdquo;
        </span>
        .
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Try a boss, charm, area, character, or skill name.
      </p>
    </div>
  );
}

function ShortcutHint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      {keys.map((k) => (
        <kbd
          key={k}
          className="inline-flex h-4 min-w-4 select-none items-center justify-center rounded border border-border/70 bg-background/60 px-1 font-mono text-[10px] text-muted-foreground"
        >
          {k}
        </kbd>
      ))}
      <span>{label}</span>
    </span>
  );
}
