import type { Character } from "@/lib/schema";

import aspidHunter from "./aspid-hunter";
import baldur from "./baldur";
import belfly from "./belfly";
import bretta from "./bretta";
import cloth from "./cloth";
import confessorJiji from "./confessor-jiji";
import cornifer from "./cornifer";
import crawlid from "./crawlid";
import elderbug from "./elderbug";
import gruzzer from "./gruzzer";
import huskBully from "./husk-bully";
import huskHornhead from "./husk-hornhead";
import huskWarrior from "./husk-warrior";
import iselda from "./iselda";
import leapingHusk from "./leaping-husk";
import lemm from "./lemm";
import mantisWarrior from "./mantis-warrior";
import mantisYouth from "./mantis-youth";
import mosskin from "./mosskin";
import myla from "./myla";
import quirrel from "./quirrel";
import salubra from "./salubra";
import shrumalOgre from "./shrumal-ogre";
import sly from "./sly";
import theLastStag from "./the-last-stag";
import tiktik from "./tiktik";
import vengefly from "./vengefly";
import wanderingHusk from "./wandering-husk";

const all: Character[] = [
  aspidHunter,
  baldur,
  belfly,
  bretta,
  cloth,
  confessorJiji,
  cornifer,
  crawlid,
  elderbug,
  gruzzer,
  huskBully,
  huskHornhead,
  huskWarrior,
  iselda,
  leapingHusk,
  lemm,
  mantisWarrior,
  mantisYouth,
  mosskin,
  myla,
  quirrel,
  salubra,
  shrumalOgre,
  sly,
  theLastStag,
  tiktik,
  vengefly,
  wanderingHusk,
];

export const characters: Character[] = all.sort((a, b) =>
  a.name.localeCompare(b.name),
);
export const characterBySlug = new Map(characters.map((c) => [c.slug, c]));
