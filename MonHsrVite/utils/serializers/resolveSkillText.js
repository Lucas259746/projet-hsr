// utils/serializers/resolveSkillText.js
//
// Point d'entrée UNIQUE pour obtenir le texte (nom + description) d'une
// compétence ou d'une trace. Chaîne de priorité :
//
//   1. Override manuel (utils/serializers/skillOverrides/) — le plus fiable,
//      toi seul contrôle ce contenu
//   2. Cache Mar-7th (config/characterSkillCache.js) — automatique, mais
//      dépend d'un tiers qui peut arrêter de maintenir le dépôt
//   3. Fallback vide — jamais de crash, jamais de texte cassé. Le
//      frontend (sanitizeAndFormatDescription) affiche déjà
//      "Aucune description disponible." dans ce cas.

const { getOverride } = require("./skillOverrides");
const { getSkillTreeMeta, getSkillMeta } = require("../../config/characterSkillCache");

// Les IDs de points d'arbre pour les 4 aptitudes principales suivent
// parfois le format {avatarId}{0}{index} à 7 chiffres (ex: "1509003").
// L'ancien système Mihomo dérivait un ID de compétence à 6 chiffres en
// retirant le chiffre à l'index 4 (ex: "150903") pour interroger un
// fichier de compétences séparé. On garde ça en dernier recours.
const deriveAltSkillId = (pointId) => {
  const s = String(pointId);
  if (s.length !== 7) return null;
  return s.slice(0, 4) + s.slice(5);
};

/**
 * @param {string} pointId  point_id brut de l'API HoYoLab
 * @param {"skill"|"tree"} kind  quelle source Mar-7th interroger en priorité
 * @returns {{ name: string|null, description: string|null }}
 */
const resolveSkillText = (pointId, kind = "tree") => {
  const override = getOverride(pointId);
  if (override) {
    return { name: override.name || null, description: override.description || null };
  }

  // Essai 1 : l'ID tel quel, dans le cache correspondant au type demandé
  let cached = kind === "skill" ? getSkillMeta(pointId) : getSkillTreeMeta(pointId);
  if (cached) return { name: cached.name || null, description: cached.desc || null };

  // Essai 2 : l'ID tel quel, dans l'AUTRE cache — les deux fichiers
  // Mar-7th semblent parfois se chevaucher selon le type de nœud.
  cached = kind === "skill" ? getSkillTreeMeta(pointId) : getSkillMeta(pointId);
  if (cached) return { name: cached.name || null, description: cached.desc || null };

  // Essai 3 : ID dérivé façon Mihomo, uniquement pertinent pour les
  // aptitudes principales.
  if (kind === "skill") {
    const altId = deriveAltSkillId(pointId);
    if (altId) {
      cached = getSkillMeta(altId);
      if (cached) return { name: cached.name || null, description: cached.desc || null };
    }
  }

  // Aucune des 3 stratégies n'a fonctionné — log pour pouvoir itérer
  // rapidement si le problème persiste (retire cette ligne une fois que
  // les descriptions s'affichent correctement).
  console.warn(`⚠️  resolveSkillText: aucune correspondance pour point_id=${pointId} (kind=${kind})`);
  return { name: null, description: null };
};

module.exports = { resolveSkillText };
