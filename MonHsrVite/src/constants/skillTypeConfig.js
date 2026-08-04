// src/constants/skillTypeConfig.js
//
// Config d'affichage partagée pour les types d'aptitudes/traces.
// Avant : SKILL_TYPE_CONFIG était dupliqué à l'identique dans
// SkillCard.jsx ET BottomSection.jsx — une seule source ici.
//
// Les clés skill_* correspondent au `type` calculé côté backend par
// skillTreeMap.js (anchor + point_type -> type), plus fiable que
// l'ancien système basé sur des morceaux de nom de fichier icône.

export const SKILL_TYPE_CONFIG = {
  Normal: { label: "Attaque de base", color: "#e08c30" },
  BPSkill: { label: "Compétence", color: "#4fa3d1" },
  Ultra: { label: "Ultime", color: "#d4a0e0" },
  Talent: { label: "Talent", color: "#7ecba1" },
  Maze: { label: "Technique", color: "#aaaaaa" },
  MazeNormal: { label: "Technique", color: "#aaaaaa" },
  // ⚠️ Mémo-sprites non encore vérifiés avec un vrai JSON HoYoLab — voir
  // note dans skillTreeMap.js backend. Ces clés restent au cas où.
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
