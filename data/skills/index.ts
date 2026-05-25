import type { Skill } from "@/lib/schema";

import abyssShriek from "./abyss-shriek";
import awokenDreamNail from "./awoken-dream-nail";
import crystalHeart from "./crystal-heart";
import cycloneSlash from "./cyclone-slash";
import dashSlash from "./dash-slash";
import descendingDark from "./descending-dark";
import desolateDive from "./desolate-dive";
import dreamGate from "./dream-gate";
import dreamNail from "./dream-nail";
import greatSlash from "./great-slash";
import howlingWraiths from "./howling-wraiths";
import ismasTear from "./ismas-tear";
import mantisClaw from "./mantis-claw";
import monarchWings from "./monarch-wings";
import mothwingCloak from "./mothwing-cloak";
import shadeCloak from "./shade-cloak";
import shadeSoul from "./shade-soul";
import vengefulSpirit from "./vengeful-spirit";

const all: Skill[] = [
  abyssShriek,
  awokenDreamNail,
  crystalHeart,
  cycloneSlash,
  dashSlash,
  descendingDark,
  desolateDive,
  dreamGate,
  dreamNail,
  greatSlash,
  howlingWraiths,
  ismasTear,
  mantisClaw,
  monarchWings,
  mothwingCloak,
  shadeCloak,
  shadeSoul,
  vengefulSpirit,
];

export const skills: Skill[] = all.sort((a, b) => a.name.localeCompare(b.name));
export const skillBySlug = new Map(skills.map((s) => [s.slug, s]));
