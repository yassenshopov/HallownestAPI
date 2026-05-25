import type { Character } from "@/lib/schema";

import aluba from "./aluba";
import aspidHunter from "./aspid-hunter";
import baldur from "./baldur";
import bardoon from "./bardoon";
import belfly from "./belfly";
import boofly from "./boofly";
import bretta from "./bretta";
import brumm from "./brumm";
import cloth from "./cloth";
import confessorJiji from "./confessor-jiji";
import cornifer from "./cornifer";
import crawlid from "./crawlid";
import dirtcarver from "./dirtcarver";
import divine from "./divine";
import elderbug from "./elderbug";
import emilitia from "./emilitia";
import folly from "./folly";
import foolEater from "./fool-eater";
import garpede from "./garpede";
import goam from "./goam";
import greatHopper from "./great-hopper";
import greatHuskSentry from "./great-husk-sentry";
import grimm from "./grimm";
import grubfather from "./grubfather";
import gruzzer from "./gruzzer";
import heavySentry from "./heavy-sentry";
import herrahTheBeast from "./herrah-the-beast";
import hopper from "./hopper";
import hornet from "./hornet";
import huskBully from "./husk-bully";
import huskDandy from "./husk-dandy";
import huskHornhead from "./husk-hornhead";
import huskMiner from "./husk-miner";
import huskSentry from "./husk-sentry";
import huskWarrior from "./husk-warrior";
import iselda from "./iselda";
import jinn from "./jinn";
import joni from "./joni";
import lanceSentry from "./lance-sentry";
import leapingHusk from "./leaping-husk";
import legEater from "./leg-eater";
import lemm from "./lemm";
import lightseed from "./lightseed";
import lurienTheWatcher from "./lurien-the-watcher";
import mantisTraitor from "./mantis-traitor";
import mantisWarrior from "./mantis-warrior";
import mantisYouth from "./mantis-youth";
import marissa from "./marissa";
import maskMaker from "./mask-maker";
import maskfly from "./maskfly";
import mawlurk from "./mawlurk";
import midwife from "./midwife";
import millibelleTheBanker from "./millibelle-the-banker";
import monomonTheTeacher from "./monomon-the-teacher";
import mossKnight from "./moss-knight";
import mossProphet from "./moss-prophet";
import mosscreep from "./mosscreep";
import mossfly from "./mossfly";
import mosskin from "./mosskin";
import mrMushroom from "./mr-mushroom";
import myla from "./myla";
import nailmasterMato from "./nailmaster-mato";
import nailmasterOro from "./nailmaster-oro";
import nailmasterSheo from "./nailmaster-sheo";
import nailsmith from "./nailsmith";
import ooma from "./ooma";
import primalAspid from "./primal-aspid";
import quirrel from "./quirrel";
import royalRetainer from "./royal-retainer";
import salubra from "./salubra";
import seer from "./seer";
import shadowCreeper from "./shadow-creeper";
import shrumalOgre from "./shrumal-ogre";
import shrumeling from "./shrumeling";
import sly from "./sly";
import snailShaman from "./snail-shaman";
import soulTwister from "./soul-twister";
import squit from "./squit";
import stalkingDevout from "./stalking-devout";
import sturdyFool from "./sturdy-fool";
import theHunter from "./the-hunter";
import theLastStag from "./the-last-stag";
import tiktik from "./tiktik";
import tiso from "./tiso";
import uoma from "./uoma";
import vengefly from "./vengefly";
import volatileMosskin from "./volatile-mosskin";
import wanderingHusk from "./wandering-husk";
import whiteLady from "./white-lady";
import zote from "./zote";

const all: Character[] = [
  aluba,
  aspidHunter,
  baldur,
  bardoon,
  belfly,
  boofly,
  bretta,
  brumm,
  cloth,
  confessorJiji,
  cornifer,
  crawlid,
  dirtcarver,
  divine,
  elderbug,
  emilitia,
  folly,
  foolEater,
  garpede,
  goam,
  greatHopper,
  greatHuskSentry,
  grimm,
  grubfather,
  gruzzer,
  heavySentry,
  herrahTheBeast,
  hopper,
  hornet,
  huskBully,
  huskDandy,
  huskHornhead,
  huskMiner,
  huskSentry,
  huskWarrior,
  iselda,
  jinn,
  joni,
  lanceSentry,
  leapingHusk,
  legEater,
  lemm,
  lightseed,
  lurienTheWatcher,
  mantisTraitor,
  mantisWarrior,
  mantisYouth,
  marissa,
  maskMaker,
  maskfly,
  mawlurk,
  midwife,
  millibelleTheBanker,
  monomonTheTeacher,
  mossKnight,
  mossProphet,
  mosscreep,
  mossfly,
  mosskin,
  mrMushroom,
  myla,
  nailmasterMato,
  nailmasterOro,
  nailmasterSheo,
  nailsmith,
  ooma,
  primalAspid,
  quirrel,
  royalRetainer,
  salubra,
  seer,
  shadowCreeper,
  shrumalOgre,
  shrumeling,
  sly,
  snailShaman,
  soulTwister,
  squit,
  stalkingDevout,
  sturdyFool,
  theHunter,
  theLastStag,
  tiktik,
  tiso,
  uoma,
  vengefly,
  volatileMosskin,
  wanderingHusk,
  whiteLady,
  zote,
];

export const characters: Character[] = all.sort((a, b) =>
  a.name.localeCompare(b.name),
);
export const characterBySlug = new Map(characters.map((c) => [c.slug, c]));
