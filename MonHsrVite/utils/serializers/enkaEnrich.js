// Ajoute les données Enka disponibles au personnage HoYoLab existant.

const { resolveSkillText, shortenStatLabel } = require("./resolveSkillText");
const { getRelicMeta, getRelicSetMeta } = require("../../config/relicCache");
const { getNodeType, getRawSkillType, MAIN_NODE_TYPES } = require("./skillTreeMap");

// Les suffixes Enka identifient les positions de l'arbre de traces.
const SUFFIX_TO_ANCHOR = {
  "001": "Point01",
  "002": "Point02",
  "003": "Point03",
  "004": "Point04",
  "007": "Point05",
  101: "Point06",
  102: "Point07",
  103: "Point08",
  201: "Point09",
  202: "Point10",
  203: "Point11",
  204: "Point12",
  205: "Point13",
  206: "Point14",
  207: "Point15",
  208: "Point16",
  209: "Point17",
  210: "Point18",
  301: "Point19",
  302: "Point20",
};

const ANCHOR_TO_TYPE = {
  Point01: "skill_basic",
  Point02: "skill_skill",
  Point03: "skill_ultra",
  Point04: "skill_talent",
  Point05: "skill_tech",
  Point06: "trace_a2",
  Point07: "trace_a4",
  Point08: "trace_a6",
  Point19: "memo_skill",
  Point20: "memo_talent",
};

const ANCHOR_TO_SKILL_TYPE = {
  Point01: "Normal",
  Point02: "BPSkill",
  Point03: "Ultra",
  Point04: "Talent",
  Point05: "Maze",
};

// Les bonus d'Éidolons restent séparés du niveau de base.
const MAX_LEVEL_BY_ANCHOR = {
  Point01: 6,
  Point02: 10,
  Point03: 10,
  Point04: 10,
  Point05: 1,
  Point06: 1,
  Point07: 1,
  Point08: 1,
  Point19: 6,
  Point20: 6,
};
const getMaxLevel = (anchor) => MAX_LEVEL_BY_ANCHOR[anchor] || 1;

const getEidolonBonus = (anchor, eidolons = 0) => {
  const level = Number(eidolons) || 0;
  if (anchor === "Point01") return level >= 5 ? 1 : 0;
  if (["Point02", "Point04"].includes(anchor)) return level >= 3 ? 2 : 0;
  if (anchor === "Point03") return level >= 5 ? 2 : 0;
  return 0;
};

const classifyPointId = (pointId) => {
  const suffix = String(pointId).slice(-3);
  const anchor = SUFFIX_TO_ANCHOR[suffix] || null;
  const type = anchor ? ANCHOR_TO_TYPE[anchor] || "stat_node" : "unknown";
  return { anchor, type };
};

// Libellés des propriétés envoyées par Enka.
const PROPERTY_LABELS = {
  HPDelta: "PV",
  HPAddedRatio: "PV",
  AttackDelta: "ATQ",
  AttackAddedRatio: "ATQ",
  DefenceDelta: "DÉF",
  DefenceAddedRatio: "DÉF",
  SpeedDelta: "VIT",
  CriticalChance: "Taux Critique",
  CriticalChanceBase: "Taux Critique",
  CriticalDamage: "DGT Critiques",
  CriticalDamageBase: "DGT Critiques",
  StatusProbability: "Chances d'Effet",
  StatusResistance: "RES aux Effets",
  BreakDamageAddedRatio: "Effet de Rupture",
  HealRatioBase: "Taux de Soin",
  SPRatioBase: "Régén. Énergie",
  PhysicalAddedRatio: "Bonus DGT Physique",
  FireAddedRatio: "Bonus DGT Feu",
  IceAddedRatio: "Bonus DGT Glace",
  ThunderAddedRatio: "Bonus DGT Foudre",
  WindAddedRatio: "Bonus DGT Vent",
  QuantumAddedRatio: "Bonus DGT Quantique",
  ImaginaryAddedRatio: "Bonus DGT Imaginaire",
};

// Les propriétés Delta sont plates ; les autres sont exprimées en pourcentage.
const isPercentType = (type) => !type.endsWith("Delta");

const formatPropValue = (type, value) => {
  if (isPercentType(type)) {
    return `${(value * 100).toFixed(1)}%`;
  }
  return String(Math.round(value));
};

const RELIC_SLOT_LABELS = {
  1: "Tête",
  2: "Main",
  3: "Corps",
  4: "Pied",
  5: "Sphère",
  6: "Corde",
};

/**
 * Sérialise une relique Enka (avec _flat.props déjà calculés par le jeu)
 * vers le même format que utils/serializers/relic.js.
 * @param {object} relic  entrée brute de enkaDetail.relicList
 * @param {Object.<string,string>} iconByType  { "Tête": url, "Main": url, ... }
 *   récupéré depuis les reliques HoYoLab d'origine (Enka ne fournit pas
 *   d'URL d'icône) — voir mergeEnkaIntoCharacter.
 */
const serializeEnkaRelic = (relic, iconByType = {}) => {
  const props = relic._flat?.props || [];
  const [mainProp, ...subProps] = props;
  const meta = getRelicMeta(relic.tid);
  const setMeta = getRelicSetMeta(relic._flat?.setID);
  const type = RELIC_SLOT_LABELS[relic.type] || "Slot inconnu";

  return {
    id: String(relic.tid),
    name: meta?.name || null,
    iconUrl: iconByType[type] || null,
    type,
    setId: relic._flat?.setID ? String(relic._flat.setID) : null,
    set: setMeta?.name || null,
    level: relic.level != null ? Number(relic.level) : null,
    rarity: meta?.rarity != null ? Number(meta.rarity) : null,
    mainStat: mainProp
      ? {
          property: PROPERTY_LABELS[mainProp.type] || mainProp.type,
          value: formatPropValue(mainProp.type, mainProp.value),
          isPercent: isPercentType(mainProp.type),
        }
      : null,
    subStats: subProps.map((sub) => ({
      property: PROPERTY_LABELS[sub.type] || sub.type,
      value: formatPropValue(sub.type, sub.value),
      isPercent: isPercentType(sub.type),
    })),
  };
};

/**
 * Reconstruit relicSets à partir des reliques enrichies (setId + count),
 * avec les descriptions 2/4 pièces via relicCache.
 */
const extractEnkaRelicSets = (relicList) => {
  const bySet = {};
  for (const relic of relicList) {
    const setId = relic._flat?.setID;
    if (!setId) continue;
    bySet[setId] = (bySet[setId] || 0) + 1;
  }

  const result = [];
  for (const [setId, count] of Object.entries(bySet)) {
    const setMeta = getRelicSetMeta(setId);
    if (!setMeta) continue;
    if (count >= 2 && setMeta.twoPieceDesc) {
      result.push({
        id: String(setId),
        name: setMeta.name,
        num: 2,
        desc: setMeta.twoPieceDesc,
        properties: [],
      });
    }
    if (count >= 4 && setMeta.fourPieceDesc) {
      result.push({
        id: String(setId),
        name: setMeta.name,
        num: 4,
        desc: setMeta.fourPieceDesc,
        properties: [],
      });
    }
  }
  return result;
};

/**
 * Construit le skillTree complet à partir de skillTreeList d'Enka —
 * inclut la Technique et les 10 nœuds de stats mineurs, absents de
 * l'endpoint HoYoLab rpgcultivate.
 *
 * @param {Array} skillTreeList  enkaDetail.skillTreeList
 * @param {Array} originalSkillTree Arbre initial utilisé pour récupérer les icônes.
 */
const buildEnkaSkillTree = (skillTreeList, originalSkillTree = [], eidolons = 0) => {
  const iconByAnchor = {};
  for (const node of originalSkillTree) {
    if (node.anchor && node.icon) iconByAnchor[node.anchor] = node.icon;
  }

  return skillTreeList
    .map((point) => {
      const { anchor, type } = classifyPointId(point.pointId);
      if (!anchor) return null;

      const isMainAbility = MAIN_NODE_TYPES.has(type);
      const resolved = resolveSkillText(
        point.pointId,
        isMainAbility ? "skill" : "tree",
      );
      const level = Math.min(Number(point.level) || 0, getMaxLevel(anchor));
      const maxLevel = getMaxLevel(anchor);
      const bonusLevel = getEidolonBonus(anchor, eidolons);

      return {
        id: String(point.pointId),
        anchor,
        parent: null,
        type,
        level,
        maxLevel,
        bonusLevel,
        icon: iconByAnchor[anchor] || resolved.icon || null,
        propLabel: type === "stat_node" ? shortenStatLabel(resolved.name) : resolved.name || null,
        name: type === "stat_node" ? shortenStatLabel(resolved.name) : resolved.name || null,
        description: resolved.description || "",
      };
    })
    .filter(Boolean);
};

/**
 * Reconstruit skills[] (les 4-5 aptitudes principales) à partir du
 * skillTree enrichi.
 */
const buildEnkaSkills = (skillTree) => {
  return skillTree
    .filter((n) => MAIN_NODE_TYPES.has(n.type))
    .map((n) => {
      const anchor = n.anchor;
      const rawType = ANCHOR_TO_SKILL_TYPE[anchor] || "Maze";
      return {
        id: n.id,
        name: n.name || null,
        type: rawType,
        typeText: null,
        icon: n.icon || null,
        effect: null,
        level: n.level,
        maxLevel: n.maxLevel,
        bonusLevel: n.bonusLevel || 0,
        description: n.description || "",
        simpleDesc: "",
        params: [],
      };
    });
};

/**
 * Fusionne les données Enka sur un personnage déjà sérialisé (HoYoLab).
 * Retourne le personnage initial si l'enrichissement échoue.
 * @param {object} character  personnage déjà sérialisé par character.js
 * @param {object|null} enkaDetail  entrée correspondante de avatarDetailList
 */
const mergeEnkaIntoCharacter = (character, enkaDetail) => {
  if (!enkaDetail) return character;

  try {
    const iconByRelicType = {};
    for (const relic of character.relics || []) {
      if (relic.type && relic.iconUrl)
        iconByRelicType[relic.type] = relic.iconUrl;
    }

    const equippedRelics = (enkaDetail.relicList || []).filter(
      (relic) => relic?.tid && relic?._flat?.props?.length > 0,
    );
    const relics = equippedRelics.map((r) =>
      serializeEnkaRelic(r, iconByRelicType),
    );
    const relicSets = extractEnkaRelicSets(equippedRelics);
    const skillTree = buildEnkaSkillTree(
      enkaDetail.skillTreeList || [],
      character.skillTree || [],
      character.eidolons || enkaDetail.rank,
    );
    const skills = buildEnkaSkills(skillTree);

    return {
      ...character,
      lightCone: character.lightCone
        ? {
            ...character.lightCone,
            superimposition:
              enkaDetail.equipment?.rank ?? character.lightCone.superimposition,
          }
        : character.lightCone,
      relics: relics.length > 0 ? relics : character.relics,
      relicSets: relicSets.length > 0 ? relicSets : character.relicSets,
      skillTree: skillTree.length > 0 ? skillTree : character.skillTree,
      skills: skills.length > 0 ? skills : character.skills,
      enrichedByEnka: true,
    };
  } catch (err) {
    console.warn(
      `⚠️  Fusion Enka échouée pour ${character?.name || character?.id} (${err.message}) — données HoYoLab conservées.`,
    );
    return character;
  }
};

module.exports = { mergeEnkaIntoCharacter };
