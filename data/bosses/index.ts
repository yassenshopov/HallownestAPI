import type { Boss } from "@/lib/schema";

import absoluteRadiance from "./absolute-radiance";
import broodingMawlek from "./brooding-mawlek";
import brokenVessel from "./broken-vessel";
import brothersOroMato from "./brothers-oro-and-mato";
import collector from "./collector";
import crystalGuardian from "./crystal-guardian";
import dungDefender from "./dung-defender";
import elderHu from "./elder-hu";
import enragedGuardian from "./enraged-guardian";
import failedChampion from "./failed-champion";
import falseKnight from "./false-knight";
import flukemarm from "./flukemarm";
import galien from "./galien";
import godTamer from "./god-tamer";
import gorb from "./gorb";
import greatNailsageSly from "./great-nailsage-sly";
import greyPrinceZote from "./grey-prince-zote";
import gruzMother from "./gruz-mother";
import hiveKnight from "./hive-knight";
import hornetProtector from "./hornet-protector";
import hornetSentinel from "./hornet-sentinel";
import lostKin from "./lost-kin";
import mantisLords from "./mantis-lords";
import markoth from "./markoth";
import marmu from "./marmu";
import massiveMossCharger from "./massive-moss-charger";
import mossMother from "./moss-mother";
import nightmareKingGrimm from "./nightmare-king-grimm";
import noEyes from "./no-eyes";
import nosk from "./nosk";
import paintmasterSheo from "./paintmaster-sheo";
import pureVessel from "./pure-vessel";
import sistersOfBattle from "./sisters-of-battle";
import soulMaster from "./soul-master";
import soulTyrant from "./soul-tyrant";
import soulWarrior from "./soul-warrior";
import theHollowKnight from "./the-hollow-knight";
import theRadiance from "./the-radiance";
import traitorLord from "./traitor-lord";
import troupeMasterGrimm from "./troupe-master-grimm";
import uumuu from "./uumuu";
import vengeflyKing from "./vengefly-king";
import wingedNosk from "./winged-nosk";
import watcherKnights from "./watcher-knights";
import whiteDefender from "./white-defender";
import xero from "./xero";
import zoteTheMighty from "./zote-the-mighty";

const all: Boss[] = [
  absoluteRadiance,
  broodingMawlek,
  brokenVessel,
  brothersOroMato,
  collector,
  crystalGuardian,
  dungDefender,
  elderHu,
  enragedGuardian,
  failedChampion,
  falseKnight,
  flukemarm,
  galien,
  godTamer,
  gorb,
  greatNailsageSly,
  greyPrinceZote,
  gruzMother,
  hiveKnight,
  hornetProtector,
  hornetSentinel,
  lostKin,
  mantisLords,
  markoth,
  marmu,
  massiveMossCharger,
  mossMother,
  nightmareKingGrimm,
  noEyes,
  nosk,
  paintmasterSheo,
  pureVessel,
  sistersOfBattle,
  soulMaster,
  soulTyrant,
  soulWarrior,
  theHollowKnight,
  theRadiance,
  traitorLord,
  troupeMasterGrimm,
  uumuu,
  vengeflyKing,
  watcherKnights,
  whiteDefender,
  wingedNosk,
  xero,
  zoteTheMighty,
];

export const bosses: Boss[] = all.sort((a, b) => a.name.localeCompare(b.name));
export const bossBySlug = new Map(bosses.map((b) => [b.slug, b]));
