// utils/serializers/lightCone.js
//
// ⚠️ GAP CONNU : l'API HoYoLab ne renvoie jamais le niveau de
// superposition (surimpression 1-5) réellement équipé. equipment.skill_desc
// est un tableau de 2 textes (palier min et palier max de la description
// du passif), sans indiquer lequel s'applique. On affiche donc les DEUX,
// clairement étiquetés, plutôt que de deviner faussement lequel est actif.
//
// L'histoire du cône (storyDescription) n'est toujours pas fournie par
// cette API non plus — on continue d'utiliser lightConeCache.js (Mar-7th)
// pour ce texte précis, exactement comme avant.

const { getLightConeMeta } = require("../../config/lightConeCache");

/**
 * @param {object} equipmentBlock  detail.equipment.equipment (peut être null
 *   si le personnage n'a aucun cône équipé)
 */
const serializeLightCone = (equipmentBlock) => {
  if (!equipmentBlock) return null;

  const meta = getLightConeMeta(equipmentBlock.item_id);
  const skillDescs = equipmentBlock.skill_desc || [];

  return {
    id: String(equipmentBlock.item_id),
    name: equipmentBlock.item_name || null,
    iconUrl: equipmentBlock.item_url || null,
    level: equipmentBlock.cur_level != null ? Number(equipmentBlock.cur_level) : null,
    rarity: equipmentBlock.rarity != null ? Number(equipmentBlock.rarity) : null,

    // ⚠️ Superposition réelle inconnue — voir note en tête de fichier.
    // superimposition reste présent pour compat frontend mais vaut
    // toujours null tant qu'on n'a pas de meilleure source.
    superimposition: null,

    // Histoire (lore) — toujours via le cache Mar-7th statique
    storyDescription: meta ? meta.desc : "",

    passiveName: equipmentBlock.skill_name || (meta ? meta.skillName : "") || "",

    // Les deux paliers de description, clairement distingués. Le
    // frontend actuel (LightConeCard.jsx / CharacterDetails.jsx) n'affiche
    // que storyDescription et passiveDescription — on garde
    // passiveDescription = palier min par défaut (comportement le plus
    // sûr : sous-estimer plutôt que sur-estimer un buff), et on ajoute
    // passiveDescriptionMax pour un futur usage sans casser l'existant.
    passiveDescription: skillDescs[0] || (meta ? meta.skillDesc : "") || "",
    passiveDescriptionMax: skillDescs[skillDescs.length - 1] || "",
  };
};

module.exports = serializeLightCone;
