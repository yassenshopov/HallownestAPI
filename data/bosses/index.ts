import type { Boss } from "@/lib/schema";

import falseKnight from "./false-knight";
import hornetProtector from "./hornet-protector";
import mantisLords from "./mantis-lords";
import mossMother from "./moss-mother";

const all: Boss[] = [falseKnight, hornetProtector, mantisLords, mossMother];

export const bosses: Boss[] = all.sort((a, b) => a.name.localeCompare(b.name));
export const bossBySlug = new Map(bosses.map((b) => [b.slug, b]));
