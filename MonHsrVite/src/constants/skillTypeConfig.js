// Configuration visuelle partagée pour les types d'aptitudes et de traces.

export const SKILL_TYPE_CONFIG = {
  Normal: { label: "Attaque de base", color: "#e08c30" },
  BPSkill: { label: "Compétence", color: "#4fa3d1" },
  Ultra: { label: "Ultime", color: "#d4a0e0" },
  Talent: { label: "Talent", color: "#7ecba1" },
  Maze: { label: "Technique", color: "#aaaaaa" },
  MazeNormal: { label: "Technique", color: "#aaaaaa" },
  memo_skill: { label: "Mémo-sprite", color: "#9b59b6" },
  memo_talent: { label: "Mémo-sprite", color: "#9b59b6" },
};

export const MAIN_TYPES = new Set([
  "Normal",
  "BPSkill",
  "Ultra",
  "Talent",
  "Maze",
  "MazeNormal",
]);

export const MEMO_TYPES = new Set(["memo_skill", "memo_talent"]);
export const SPECIAL_TYPES = new Set(["ElationDamage"]);

export const TYPE_ORDER = [
  "Normal",
  "BPSkill",
  "Ultra",
  "Talent",
  "Maze",
  "MazeNormal",
];
