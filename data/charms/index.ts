import type { Charm } from "@/lib/schema";

import baldurShell from "./baldur-shell";
import carefreeMelody from "./carefree-melody";
import dashmaster from "./dashmaster";
import deepFocus from "./deep-focus";
import defendersCrest from "./defenders-crest";
import dreamWielder from "./dream-wielder";
import dreamshield from "./dreamshield";
import flukenest from "./flukenest";
import fragileGreed from "./fragile-greed";
import fragileHeart from "./fragile-heart";
import fragileStrength from "./fragile-strength";
import furyOfTheFallen from "./fury-of-the-fallen";
import gatheringSwarm from "./gathering-swarm";
import glowingWomb from "./glowing-womb";
import grimmchild from "./grimmchild";
import grubberflysElegy from "./grubberflys-elegy";
import grubsong from "./grubsong";
import heavyBlow from "./heavy-blow";
import hiveblood from "./hiveblood";
import jonisBlessing from "./jonis-blessing";
import kingsoul from "./kingsoul";
import lifebloodCore from "./lifeblood-core";
import lifebloodHeart from "./lifeblood-heart";
import longnail from "./longnail";
import markOfPride from "./mark-of-pride";
import nailmastersGlory from "./nailmasters-glory";
import quickFocus from "./quick-focus";
import quickSlash from "./quick-slash";
import shamanStone from "./shaman-stone";
import shapeOfUnn from "./shape-of-unn";
import sharpShadow from "./sharp-shadow";
import soulCatcher from "./soul-catcher";
import soulEater from "./soul-eater";
import spellTwister from "./spell-twister";
import sporeShroom from "./spore-shroom";
import sprintmaster from "./sprintmaster";
import stalwartShell from "./stalwart-shell";
import steadyBody from "./steady-body";
import thornsOfAgony from "./thorns-of-agony";
import unbreakableGreed from "./unbreakable-greed";
import unbreakableHeart from "./unbreakable-heart";
import unbreakableStrength from "./unbreakable-strength";
import voidHeart from "./void-heart";
import waywardCompass from "./wayward-compass";
import weaversong from "./weaversong";

const all: Charm[] = [
  baldurShell,
  carefreeMelody,
  dashmaster,
  deepFocus,
  defendersCrest,
  dreamWielder,
  dreamshield,
  flukenest,
  fragileGreed,
  fragileHeart,
  fragileStrength,
  furyOfTheFallen,
  gatheringSwarm,
  glowingWomb,
  grimmchild,
  grubberflysElegy,
  grubsong,
  heavyBlow,
  hiveblood,
  jonisBlessing,
  kingsoul,
  lifebloodCore,
  lifebloodHeart,
  longnail,
  markOfPride,
  nailmastersGlory,
  quickFocus,
  quickSlash,
  shamanStone,
  shapeOfUnn,
  sharpShadow,
  soulCatcher,
  soulEater,
  spellTwister,
  sporeShroom,
  sprintmaster,
  stalwartShell,
  steadyBody,
  thornsOfAgony,
  unbreakableGreed,
  unbreakableHeart,
  unbreakableStrength,
  voidHeart,
  waywardCompass,
  weaversong,
];

export const charms: Charm[] = all.sort((a, b) => {
  const ao = a.inventoryOrder ?? Number.POSITIVE_INFINITY;
  const bo = b.inventoryOrder ?? Number.POSITIVE_INFINITY;
  if (ao !== bo) return ao - bo;
  return a.name.localeCompare(b.name);
});
export const charmBySlug = new Map(charms.map((c) => [c.slug, c]));
