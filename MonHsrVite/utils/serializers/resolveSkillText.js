// utils/serializers/resolveSkillText.js
//
// Point d'entrée UNIQUE pour obtenir le texte (nom + description + icône)
// d'une compétence ou d'une trace.
//
// Mécanique RÉELLE confirmée sur données (point_id 1201002) :
// - Pour les 4-5 aptitudes principales, l'entrée dans
//   character_skill_trees.json a bien un anchor/max_level/icon, mais
//   name/desc y sont VIDES par construction. Le vrai texte vit dans
//   character_skills.json, référencé explicitement via le champ
//   `level_up_skills[0].id` de l'entrée trouvée — ce n'est PAS une
//   transformation d'ID à deviner, c'est une référence directe fournie
//   par les données elles-mêmes.
// - Pour les traces/nœuds de stats, name/desc sont directement présents
//   dans character_skill_trees.json.
//
// Chaîne de priorité :
//   1. Override manuel (utils/serializers/skillOverrides/)
//   2. character_skill_trees.json, en suivant level_up_skills si présent
//   3. character_skills.json directement (filet de sécurité)
//   4. Vide — jamais de crash, le frontend affiche déjà un fallback propre

const { getOverride } = require("./skillOverrides");
const {
  getSkillTreeMeta,
  getSkillMeta,
} = require("../../config/characterSkillCache");

const ICON_BASE_URL =
  "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/";
const resolveIconUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${ICON_BASE_URL}${path}`;
};

const hasText = (entry) => !!(entry && (entry.name || entry.desc));

/**
 * @param {string} pointId  point_id brut (HoYoLab ou Enka — même schéma)
 * @param {"skill"|"tree"} kind  conservé pour compat avec les appelants
 *   existants ; n'influence plus vraiment la logique (character_skill_trees
 *   couvre les deux cas), mais garde la signature stable.
 * @returns {{ name: string|null, description: string|null, icon: string|null }}
 */
const resolveSkillText = (pointId, kind = "tree") => {
  const override = getOverride(pointId);
  if (override) {
    return {
      name: override.name || null,
      description: override.description || null,
      icon: override.icon || null,
    };
  }

  const treeEntry = getSkillTreeMeta(pointId);

  // Cas aptitude principale : name/desc vides, mais level_up_skills
  // pointe vers le vrai skill dans character_skills.json.
  if (treeEntry?.level_up_skills?.length) {
    const realSkillId = treeEntry.level_up_skills[0].id;
    const skillEntry = getSkillMeta(realSkillId);
    if (hasText(skillEntry)) {
      return {
        name: skillEntry.name || null,
        description: skillEntry.desc || null,
        icon: resolveIconUrl(treeEntry.icon) || resolveIconUrl(skillEntry.icon),
      };
    }
  }

  // Cas général : name/desc directement dans l'entrée trouvée
  if (hasText(treeEntry)) {
    return {
      name: treeEntry.name || null,
      description: treeEntry.desc || null,
      icon: resolveIconUrl(treeEntry.icon),
    };
  }

  // Filet de sécurité : l'ID tel quel directement dans character_skills.json
  const skillEntry = getSkillMeta(pointId);
  if (hasText(skillEntry)) {
    return {
      name: skillEntry.name || null,
      description: skillEntry.desc || null,
      icon: resolveIconUrl(skillEntry.icon),
    };
  }

  console.warn(
    `⚠️  resolveSkillText: aucune correspondance pour point_id=${pointId} (kind=${kind})`,
  );
  return {
    name: null,
    description: null,
    icon: treeEntry ? resolveIconUrl(treeEntry.icon) : null,
  };
};

module.exports = { resolveSkillText };
