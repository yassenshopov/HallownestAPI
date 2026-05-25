import type { Area } from "@/lib/schema";

import ancestralMound from "./ancestral-mound";
import ancientBasin from "./ancient-basin";
import beastsDen from "./beasts-den";
import birthplace from "./birthplace";
import blueLake from "./blue-lake";
import castOffShell from "./cast-off-shell";
import cityOfTears from "./city-of-tears";
import colosseumOfFools from "./colosseum-of-fools";
import crystalPeak from "./crystal-peak";
import deepFocusCavern from "./deep-focus-cavern";
import deepnest from "./deepnest";
import dirtmouth from "./dirtmouth";
import distantVillage from "./distant-village";
import failedTramway from "./failed-tramway";
import fogCanyon from "./fog-canyon";
import forgottenCrossroads from "./forgotten-crossroads";
import fungalCore from "./fungal-core";
import fungalWastes from "./fungal-wastes";
import godhome from "./godhome";
import greenpath from "./greenpath";
import hallOfGods from "./hall-of-gods";
import hallownestsCrown from "./hallownests-crown";
import hiddenStation from "./hidden-station";
import hive from "./hive";
import howlingCliffs from "./howling-cliffs";
import ismasGrove from "./ismas-grove";
import junkPit from "./junk-pit";
import kingsPass from "./kings-pass";
import kingsStation from "./kings-station";
import kingdomsEdge from "./kingdoms-edge";
import lakeOfUnn from "./lake-of-unn";
import lifebloodCoreChamber from "./lifeblood-core-chamber";
import mantisVillage from "./mantis-village";
import mosshome from "./mosshome";
import overgrownMound from "./overgrown-mound";
import palaceGrounds from "./palace-grounds";
import pantheons from "./pantheons";
import pathOfPain from "./path-of-pain";
import pleasureHouse from "./pleasure-house";
import queensGardens from "./queens-gardens";
import queensStation from "./queens-station";
import restingGrounds from "./resting-grounds";
import royalWaterways from "./royal-waterways";
import soulSanctum from "./soul-sanctum";
import spiritsGlade from "./spirits-glade";
import stagNest from "./stag-nest";
import stoneSanctuary from "./stone-sanctuary";
import teachersArchives from "./teachers-archives";
import templeOfTheBlackEgg from "./temple-of-the-black-egg";
import theAbyss from "./the-abyss";
import towerOfLove from "./tower-of-love";
import weaversDen from "./weavers-den";
import whitePalace from "./white-palace";

const all: Area[] = [
  ancestralMound,
  ancientBasin,
  beastsDen,
  birthplace,
  blueLake,
  castOffShell,
  cityOfTears,
  colosseumOfFools,
  crystalPeak,
  deepFocusCavern,
  deepnest,
  dirtmouth,
  distantVillage,
  failedTramway,
  fogCanyon,
  forgottenCrossroads,
  fungalCore,
  fungalWastes,
  godhome,
  greenpath,
  hallOfGods,
  hallownestsCrown,
  hiddenStation,
  hive,
  howlingCliffs,
  ismasGrove,
  junkPit,
  kingsPass,
  kingsStation,
  kingdomsEdge,
  lakeOfUnn,
  lifebloodCoreChamber,
  mantisVillage,
  mosshome,
  overgrownMound,
  palaceGrounds,
  pantheons,
  pathOfPain,
  pleasureHouse,
  queensGardens,
  queensStation,
  restingGrounds,
  royalWaterways,
  soulSanctum,
  spiritsGlade,
  stagNest,
  stoneSanctuary,
  teachersArchives,
  templeOfTheBlackEgg,
  theAbyss,
  towerOfLove,
  weaversDen,
  whitePalace,
];

export const areas: Area[] = all.sort((a, b) => a.name.localeCompare(b.name));
export const areaBySlug = new Map(areas.map((a) => [a.slug, a]));
