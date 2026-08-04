// src/components/bottomSection/useBottomSection.js
//
// ⚠️ Les nœuds "mémo-sprite" (memo_skill/memo_talent) ne sont pas encore
// vérifiés avec un vrai JSON HoYoLab pour un personnage qui en possède
// (Sunday, Robin, Tribbie...). skillTreeMap.js (backend) ne produit pas
// encore ces types — à corriger une fois testé avec un tel personnage.
// En l'état, memoSkills sera probablement toujours vide.

import { useState } from "react";
import {
  MAIN_TYPES,
  MEMO_TYPES,
  SPECIAL_TYPES,
  TYPE_ORDER,
} from "../../constants/skillTypeConfig";

export default function useBottomSection(activeCharacter) {
  const [activeTab, setActiveTab] = useState("skills");
  if (!activeCharacter) return { activeCharacter: null };

  const allSkills = activeCharacter.skills || [];
  const relics = activeCharacter.relics || [];
  const relicSets = activeCharacter.relicSets || [];
  const skillTree = activeCharacter.skillTree || [];

  const memoSkills = skillTree
    .filter((n) => MEMO_TYPES.has(n.type))
    .map((n) => ({
      id: n.id,
      name: n.name || (n.type === "memo_skill" ? "Compétence mémo-sprite" : "Talent mémo-sprite"),
      type: n.type,
      typeText: n.type,
      icon: n.icon, // URL directe désormais
      effect: null,
      level: n.level,
      maxLevel: n.maxLevel,
      description: n.description || "",
      simpleDesc: "",
    }));

  const mainSkills = TYPE_ORDER.map((t) => {
    const skillsOfType = allSkills.filter((s) => s.type === t);
    if (skillsOfType.length === 0) return null;
    return { ...skillsOfType[0], isGrouped: skillsOfType.length > 1, forms: skillsOfType };
  }).filter(Boolean);

  const specialSkillsRaw = allSkills.filter(
    (s) => SPECIAL_TYPES.has(s.type) || (!MAIN_TYPES.has(s.type) && !MEMO_TYPES.has(s.type)),
  );
  const specialByType = {};
  specialSkillsRaw.forEach((s) => {
    if (!specialByType[s.type]) specialByType[s.type] = [];
    specialByType[s.type].push(s);
  });
  const specialSkills = Object.values(specialByType).map((group) => ({
    ...group[0],
    isGrouped: group.length > 1,
    forms: group,
  }));

  return {
    activeCharacter,
    activeTab,
    setActiveTab,
    tabs: [
      { id: "skills", label: "Aptitudes" },
      { id: "relics", label: "Reliques" },
      { id: "tree", label: "Trace" },
    ],
    mainSkills,
    memoSkills,
    specialSkills,
    relics,
    relicSets,
    skillTree,
  };
}
