// utils/serializers/skillTreeMap.js
//
// Remplace l'ancienne détection de type de nœud basée sur le nom de
// fichier icône (fragile, spécifique à Mihomo). La nouvelle API HoYoLab
// donne un signal stable : anchor + point_type. Comme pathLayouts.js
// utilise déjà les mêmes clés Point01-Point18, aucune modification des
// layouts n'est nécessaire — seule cette correspondance change.

// Point01-04 = les 4 aptitudes principales (point_type: 2)
// Point05 = technique — absente des exemples observés jusqu'ici ; gérée
// par sécurité mais peut ne jamais apparaître dans cette API.
const ANCHOR_TO_NODE_TYPE = {
  Point01: "skill_basic",
  Point02: "skill_skill",
  Point03: "skill_ultra",
  Point04: "skill_talent",
  Point05: "skill_tech",
};

// Même mapping mais vers le "type" brut attendu par SKILL_TYPE_CONFIG
// (SkillCard.jsx, BottomSection.jsx, useBottomSection.js) — inchangé
// niveau frontend.
const ANCHOR_TO_SKILL_TYPE = {
  Point01: "Normal",
  Point02: "BPSkill",
  Point03: "Ultra",
  Point04: "Talent",
  Point05: "Maze",
};

// Point06/07/08 = les 3 traces majeures (point_type: 3), toujours dans
// cet ordre A2 → A4 → A6 (confirmé par min_level_limit croissant : 31,
// 51, 71 dans les deux personnages observés).
const MAJOR_TRACE_ANCHORS = ["Point06", "Point07", "Point08"];
const MAJOR_TRACE_TYPES = ["trace_a2", "trace_a4", "trace_a6"];

/**
 * Détermine le type sémantique d'un nœud d'arbre de compétences à partir
 * de son anchor et de son point_type (fournis directement par l'API).
 * @param {{anchor: string, point_type: number}} node
 * @returns {string} type utilisé par le frontend (skill_basic, trace_a2,
 *   memo_skill, memo_talent, stat_node, etc.)
 */
const getNodeType = (node) => {
  const { anchor, point_type } = node;

  // Aptitude principale
  if (point_type === 2 && ANCHOR_TO_NODE_TYPE[anchor]) {
    return ANCHOR_TO_NODE_TYPE[anchor];
  }

  // Mnémesprit (Voie du Souvenir) — confirmé sur Cyrène (1415) :
  // point_type 4, toujours anchor Point19 (compétence) / Point20 (talent).
  if (point_type === 4) {
    if (anchor === "Point19") return "memo_skill";
    if (anchor === "Point20") return "memo_talent";
    return "memo_other"; // fallback si jamais un 3e nœud mnémesprit existe
  }

  // Trace majeure — position dans MAJOR_TRACE_ANCHORS donne a2/a4/a6
  if (point_type === 3) {
    const idx = MAJOR_TRACE_ANCHORS.indexOf(anchor);
    if (idx !== -1) return MAJOR_TRACE_TYPES[idx];
    return "trace_minor"; // fallback si jamais un point_type 3 imprévu apparaît
  }

  // Nœud de statistique (Point09-18)
  if (point_type === 1) {
    return "stat_node";
  }

  return "unknown";
};

/**
 * Type brut ("Normal", "BPSkill", "Ultra", "Talent", "Maze") pour les
 * 4 aptitudes principales uniquement — sert à regrouper avec
 * useBottomSection.js / SKILL_TYPE_CONFIG côté frontend.
 * @returns {string|null}
 */
const getRawSkillType = (node) => {
  if (node.point_type !== 2) return null;
  return ANCHOR_TO_SKILL_TYPE[node.anchor] || null;
};

module.exports = { getNodeType, getRawSkillType };
