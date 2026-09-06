// Détermine le type d'un nœud à partir de son anchor et de point_type.

// Les points 01 à 05 représentent les aptitudes principales.
const ANCHOR_TO_NODE_TYPE = {
  Point01: "skill_basic",
  Point02: "skill_skill",
  Point03: "skill_ultra",
  Point04: "skill_talent",
  Point05: "skill_tech",
};

// Types bruts attendus par l'interface.
const ANCHOR_TO_SKILL_TYPE = {
  Point01: "Normal",
  Point02: "BPSkill",
  Point03: "Ultra",
  Point04: "Talent",
  Point05: "Maze",
};

// Types qui correspondent aux cinq aptitudes affichées comme compétences.
const MAIN_NODE_TYPES = new Set(Object.values(ANCHOR_TO_NODE_TYPE));

// Les traces majeures suivent l'ordre A2, A4, A6.
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

  if (point_type === 2 && ANCHOR_TO_NODE_TYPE[anchor]) {
    return ANCHOR_TO_NODE_TYPE[anchor];
  }

  if (point_type === 4) {
    if (anchor === "Point19") return "memo_skill";
    if (anchor === "Point20") return "memo_talent";
    return "memo_other";
  }

  if (point_type === 3) {
    const idx = MAJOR_TRACE_ANCHORS.indexOf(anchor);
    if (idx !== -1) return MAJOR_TRACE_TYPES[idx];
    return "trace_minor";
  }

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

module.exports = { getNodeType, getRawSkillType, MAIN_NODE_TYPES };
