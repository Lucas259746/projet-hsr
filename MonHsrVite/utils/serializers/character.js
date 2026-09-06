// Convertit les données HoYoLab vers le modèle consommé par React.

const serializeRelic = require("./relic");
const { extractRelicSets } = serializeRelic;
const serializeLightCone = require("./lightCone");
const serializeStats = require("./sumStats");
const {
  sanitizeGenderTag,
  getPathName,
  getElementName,
  getAscensionFromLevel,
} = require("./helpers");
const { getNodeType, getRawSkillType } = require("./skillTreeMap");
const { resolveSkillText, shortenStatLabel } = require("./resolveSkillText");

// Correspondance entre les types bruts et les libellés affichés.
const SKILL_TYPE_LABELS = {
  Normal: "Attaque de base",
  BPSkill: "Compétence",
  Ultra: "Ultime",
  Talent: "Talent",
  Maze: "Technique",
};

// Les statistiques utilisent un libellé court pour rester lisibles dans le SVG.
const getNodeLabel = (type, resolvedName, fallback = null) =>
  type === "stat_node" ? shortenStatLabel(resolvedName) : resolvedName || fallback;

/**
 * Sérialise une des 4 aptitudes principales (depuis detail.summary.skills,
 * point_type === 2) vers le format `skills[]` attendu par le frontend.
 */
const serializeMainSkill = (node) => {
  const rawType = getRawSkillType(node); // "Normal" | "BPSkill" | "Ultra" | "Talent"
  const resolved = resolveSkillText(node.point_id, "skill");

  return {
    id: String(node.point_id),
    name:
      resolved.name ||
      node.item_name ||
      SKILL_TYPE_LABELS[rawType] ||
      "Aptitude",
    type: rawType || "Normal",
    typeText: SKILL_TYPE_LABELS[rawType] || null,
    effect: null,
    level: node.cur_level != null ? Number(node.cur_level) : 1,
    maxLevel: node.max_level != null ? Number(node.max_level) : null,
    icon: node.item_url || null,
    description: resolved.description || "",
    simpleDesc: "",
    params: [],
  };
};

/**
 * Sérialise un nœud de l'arbre de traces (depuis detail.summary.skills_other,
 * point_type 1 ou 3) vers le format `skillTree[]` attendu par le frontend.
 * L'anchor (Point01-Point18) est préservé tel quel — pathLayouts.js n'a
 * besoin d'aucune modification.
 */
const serializeTraceNode = (node) => {
  const type = getNodeType(node);
  const resolved = resolveSkillText(node.point_id, "tree");
  const name = getNodeLabel(type, resolved.name, node.item_name);

  return {
    id: String(node.point_id),
    anchor: node.anchor,
    parent:
      node.pre_point && node.pre_point !== "0" ? String(node.pre_point) : null,
    type,
    level: node.cur_level != null ? Number(node.cur_level) : null,
    maxLevel: node.max_level != null ? Number(node.max_level) : null,
    icon: node.item_url || null,
    propLabel: type === "stat_node" ? name : resolved.name || null,
    name,
    description: resolved.description || "",
  };
};

/**
 * Construit le skillTree complet (aptitudes principales + mnémesprit +
 * traces + nœuds de stats) à partir de detail.summary.skills et
 * detail.summary.skills_other.
 */
/**
 * Construit la Technique à partir de son identifiant prévisible et du cache.
 */
const buildTechniqueNode = (avatarId) => {
  const pointId = `${avatarId}007`;
  const resolved = resolveSkillText(pointId, "skill");
  if (!resolved.name && !resolved.description) return null; // rien trouvé dans le cache — pas de nœud vide inutile

  return {
    id: pointId,
    anchor: "Point05",
    parent: null,
    type: "skill_tech",
    level: 1,
    maxLevel: 1,
    icon: resolved.icon || null,
    propLabel: null,
    name: resolved.name,
    description: resolved.description || "",
  };
};

const buildSkillTree = (summary) => {
  const mainNodes = (summary?.skills || []).map(serializeTraceNode);
  const otherNodes = (summary?.skills_other || []).map(serializeTraceNode);
  return [...mainNodes, ...otherNodes];
};

/**
 * @param {object} character  { basic, detail } tel que renvoyé par
 *   config/hoyolab.js fetchFullProfile()
 */
const serializeCharacter = (character) => {
  if (!character?.basic) return null;
  const { basic, detail } = character;

  const level = basic.cur_level != null ? Number(basic.cur_level) : null;
  const summary = detail?.summary || null;

  const techniqueNode = buildTechniqueNode(basic.item_id);
  const techniqueSkill = techniqueNode
    ? {
        id: techniqueNode.id,
        name: techniqueNode.name,
        type: "Maze",
        typeText: null,
        icon: techniqueNode.icon,
        effect: null,
        level: 1,
        maxLevel: 1,
        description: techniqueNode.description,
        simpleDesc: "",
        params: [],
      }
    : null;

  return {
    id: basic.item_id ? String(basic.item_id) : null,
    name: sanitizeGenderTag(basic.item_name) || basic.item_name || null,
    iconUrl: basic.new_icon_url || basic.icon_url || null,
    level,
    ascension: level != null ? getAscensionFromLevel(level) : null,
    eidolons: basic.rank != null ? Number(basic.rank) : 0,
    rarity: basic.rarity != null ? Number(basic.rarity) : null,
    path: getPathName(basic.avatar_base_type),
    combatType: getElementName(basic.damage_type),

    lightCone: detail?.equipment?.equipment
      ? serializeLightCone(detail.equipment.equipment)
      : null,

    relics: (detail?.relics_v2?.dress_relics || [])
      .filter(
        (relic) =>
          relic?.item_id && relic?.item_name && relic?.main_property_name,
      )
      .map(serializeRelic)
      .filter(Boolean),

    relicSets: extractRelicSets(detail?.relics_v2?.dress_relics || []),

    skills: [
      ...(summary?.skills || [])
        .filter((n) => n.point_type === 2)
        .map(serializeMainSkill)
        .filter(Boolean),
      ...(techniqueSkill ? [techniqueSkill] : []),
    ],

    skillTree: [
      ...buildSkillTree(summary),
      ...(techniqueNode ? [techniqueNode] : []),
    ],

    stats: serializeStats(detail?.avatar_property_v2 || []),
  };
};

module.exports = serializeCharacter;
