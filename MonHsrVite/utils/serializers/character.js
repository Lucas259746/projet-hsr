// utils/serializers/character.js
//
// Combine detail.basic (données de liste) + detail.detail (détail complet)
// d'un personnage HoYoLab vers le format que le frontend React consomme
// déjà (relics, lightCone, skillTree, stats...). Voir les fichiers
// lightCone.js / relic.js / sumStats.js pour le détail des champs
// désormais indisponibles (superimposition, sous-stats, stats complètes).

const serializeRelic = require("./relic");
const { extractRelicSets } = require("./relic");
const serializeLightCone = require("./lightCone");
const serializeStats = require("./sumStats");
const {
  sanitizeGenderTag,
  getPathName,
  getElementName,
  getAscensionFromLevel,
} = require("./helpers");
const { getNodeType, getRawSkillType } = require("./skillTreeMap");
const { resolveSkillText } = require("./resolveSkillText");

// Config d'affichage pour les 4 aptitudes principales — inchangé côté
// frontend (SkillCard.jsx / BottomSection.jsx attendent ces clés brutes).
const SKILL_TYPE_LABELS = {
  Normal: "Attaque de base",
  BPSkill: "Compétence",
  Ultra: "Ultime",
  Talent: "Talent",
  Maze: "Technique",
};

/**
 * Sérialise une des 4 aptitudes principales (depuis detail.summary.skills,
 * point_type === 2) vers le format `skills[]` attendu par le frontend.
 */
const serializeMainSkill = (node) => {
  const rawType = getRawSkillType(node); // "Normal" | "BPSkill" | "Ultra" | "Talent"
  const resolved = resolveSkillText(node.point_id, "skill");

  return {
    id: String(node.point_id),
    // Nom réel via override/Mar-7th si disponible, sinon le libellé
    // générique renvoyé par HoYoLab (ex: "Ultime", "Talent"...).
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
  const type = getNodeType(node); // trace_a2/a4/a6, stat_node, skill_*
  const resolved = resolveSkillText(node.point_id, "tree");

  return {
    id: String(node.point_id),
    anchor: node.anchor,
    parent:
      node.pre_point && node.pre_point !== "0" ? String(node.pre_point) : null,
    type,
    level: node.cur_level != null ? Number(node.cur_level) : null,
    maxLevel: node.max_level != null ? Number(node.max_level) : null,
    icon: node.item_url || null,
    // ⚠️ Le libellé de stat (ex: "VIT", "CRIT%") pour les nœuds mineurs
    // dépend entièrement du cache Mar-7th/overrides — l'API HoYoLab ne le
    // fournit pas. Reste null si ni l'un ni l'autre n'a l'info ; le
    // frontend retombe déjà sur "✦" dans ce cas (useSkillTree.js).
    propLabel: resolved.name || null,
    name: resolved.name || node.item_name || null,
    description: resolved.description || "",
  };
};

/**
 * Construit le skillTree complet (aptitudes principales + mnémesprit +
 * traces + nœuds de stats) à partir de detail.summary.skills et
 * detail.summary.skills_other.
 */
/**
 * La Technique (anchor Point05) n'est JAMAIS renvoyée par l'endpoint
 * HoYoLab rpgcultivate — mais elle n'a besoin d'aucune donnée
 * spécifique au joueur : elle n'a qu'un seul niveau, pas de matériaux
 * de montée, et le texte est fixe pour un personnage donné. On peut
 * donc la synthétiser pour TOUS les persos (vitrine ou non) juste avec
 * son ID prévisible ({avatarId}007, confirmé sur données Enka réelles)
 * et le cache Mar-7th qu'on a déjà.
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
