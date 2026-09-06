// Prépare les données nécessaires au rendu interactif de l'arbre de traces.
// Le backend fournit déjà le type et les textes de chaque nœud.

import { useState } from "react";
import { PATH_LAYOUTS } from "../../pathComp/pathLayouts";
import { shortenStatLabel } from "../../../utils/textFormat";

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

// Relie un nœud de l'arbre aux compétences regroupées dans le panneau.
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
      const statLabel = shortenStatLabel(selectedNode.propLabel || "✦");
      traceName = `Bonus de Statistique : ${statLabel}`;
      traceDesc = `Nœud d'optimisation débloquant un bonus permanent de ${statLabel} pour ce personnage.`;
    } else if (groupedForms) {
      traceName = groupedForms.primarySkill.name || selectedNode?.name || selectedNode?.anchor;
      traceDesc = null;
    } else {
      traceName = selectedNode?.name || selectedNode?.anchor;
      traceDesc = selectedNode?.description;
    }
  }

  const traceIcon = selectedNode?.icon || null;
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
