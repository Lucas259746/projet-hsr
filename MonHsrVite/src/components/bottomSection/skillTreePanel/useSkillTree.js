// src/components/bottomSection/skillTreePanel/useSkillTree.js
//
// Avant : ce hook devinait le type de chaque nœud en cherchant des
// morceaux de texte dans node.icon (ex: "basic_atk", "_skill."...) —
// fragile, dépendant du nom de fichier Mihomo.
// Maintenant : le backend (skillTreeMap.js) calcule déjà node.type de
// façon fiable à partir de anchor + point_type. Ce hook n'a plus qu'à
// s'en servir. node.icon est désormais une URL directe (plus besoin de
// imageMap/getSkillIcon pour la résoudre).
//
// pathLayouts.js n'a besoin d'aucune modification : les clés d'anchor
// (Point01-Point18) sont identiques des deux côtés.

import { useState } from "react";
import { PATH_LAYOUTS } from "../../pathComp/pathLayouts";

const NODE_STYLE_BY_TYPE = {
  skill_basic: { color: "#c76904", size: 54, ring: true, shape: "rounded" },
  skill_skill: { color: "#22668b", size: 54, ring: true, shape: "rounded" },
  skill_ultra: { color: "#916c99", size: 54, ring: true, shape: "rounded" },
  skill_talent: { color: "#659279", size: 54, ring: true, shape: "rounded" },
  skill_tech: { color: "#634747", size: 44, ring: false, shape: "rounded" },
  trace_a2: { color: "#74591e", size: 44, ring: false, shape: "rounded" },
  trace_a4: { color: "#74591e", size: 44, ring: false, shape: "rounded" },
  trace_a6: { color: "#74591e", size: 44, ring: false, shape: "rounded" },
  stat_node: { color: "#d8b467", size: 30, ring: false, shape: "circle" },
};
const DEFAULT_NODE_STYLE = { color: "#d8b467", size: 36, ring: false, shape: "rounded" };

export const getNodeStyle = (node) => NODE_STYLE_BY_TYPE[node?.type] || DEFAULT_NODE_STYLE;

export const isStatNode = (node) => node?.type === "stat_node";

const MAIN_SKILL_NODE_TYPES = new Set([
  "skill_basic",
  "skill_skill",
  "skill_ultra",
  "skill_talent",
  "skill_tech",
]);
export const isMainSkill = (node) => MAIN_SKILL_NODE_TYPES.has(node?.type);

// Correspondance type de nœud d'arbre -> type brut de skill (pour
// regrouper avec activeCharacter.skills, comme avant).
const NODE_TYPE_TO_SKILL_TYPE = {
  skill_basic: "Normal",
  skill_skill: "BPSkill",
  skill_ultra: "Ultra",
  skill_talent: "Talent",
  skill_tech: "Maze",
};

const buildGroupedForms = (node, allSkills) => {
  if (!node || !allSkills?.length) return null;
  const targetType = NODE_TYPE_TO_SKILL_TYPE[node.type];
  if (!targetType) return null;

  const matching = allSkills.filter((s) => s.type === targetType);
  if (matching.length === 0) return null;

  return { isGrouped: matching.length > 1, forms: matching, primarySkill: matching[0] };
};

const getLayout = (path) => {
  if (!path) return PATH_LAYOUTS["Destruction"];
  return PATH_LAYOUTS[path] || PATH_LAYOUTS[path?.toLowerCase?.()] || PATH_LAYOUTS["Destruction"];
};

export default function useSkillTree({ skillTree, path, allSkills }) {
  const [selected, setSelected] = useState(null);

  if (!skillTree?.length) return { hasData: false };

  const layout = getLayout(path);
  const { positions, rootConnections } = layout;

  const byAnchor = {};
  skillTree.forEach((n) => {
    byAnchor[n.anchor] = n;
  });

  const connections = [];
  rootConnections.forEach(([fromAnchor, toAnchor]) => {
    const from = positions[fromAnchor];
    const to = positions[toAnchor];
    if (!from || !to) return;

    const fromNode = byAnchor[fromAnchor];
    const toNode = byAnchor[toAnchor];
    const fromMax = fromNode?.maxLevel || 1;
    const toMax = toNode?.maxLevel || 1;
    const maxed = fromNode?.level >= fromMax && toNode?.level >= toMax;
    connections.push({ from, to, maxed });
  });

  const total = skillTree.length;
  const unlocked = skillTree.filter((n) => n.level >= (n.maxLevel || 1)).length;
  const pct = total ? Math.round((unlocked / total) * 100) : 0;

  const selectedNode = selected ? skillTree.find((n) => n.id === selected) : null;
  const selStyle = selectedNode ? getNodeStyle(selectedNode) : null;
  const isSelectedStat = selectedNode ? isStatNode(selectedNode) : false;
  const isSelectedMain = selectedNode ? isMainSkill(selectedNode) : false;

  const groupedForms =
    selectedNode && isSelectedMain && !isSelectedStat
      ? buildGroupedForms(selectedNode, allSkills)
      : null;

  let traceName = "";
  let traceDesc = "";

  if (selectedNode) {
    if (isSelectedStat) {
      // propLabel est désormais résolu côté backend (override manuel ou
      // cache Mar-7th) — voir resolveSkillText.js
      const statLabel = selectedNode.propLabel || "✦";
      traceName = `Bonus de Statistique : ${statLabel}`;
      traceDesc = `Nœud d'optimisation débloquant un bonus permanent de ${statLabel} pour ce personnage.`;
    } else if (groupedForms) {
      traceName = groupedForms.primarySkill.name || selectedNode?.name || selectedNode?.anchor;
      traceDesc = null;
    } else {
      // name/description déjà résolus côté backend (plus besoin de
      // getTraceDetails/imageMap ici)
      traceName = selectedNode?.name || selectedNode?.anchor;
      traceDesc = selectedNode?.description;
    }
  }

  const traceIcon = selectedNode?.icon || null; // URL directe désormais
  const selectedMaxLevel = selectedNode ? selectedNode.maxLevel || 1 : 1;

  return {
    hasData: true,
    positions,
    connections,
    pct,
    unlocked,
    total,
    selected,
    setSelected,
    selectedNode,
    selStyle,
    isSelectedStat,
    isSelectedMain,
    groupedForms,
    traceName,
    traceDesc,
    traceIcon,
    selectedMaxLevel,
  };
}
