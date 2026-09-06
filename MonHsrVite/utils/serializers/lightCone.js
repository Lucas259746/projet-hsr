// Sérialise un cône de lumière et conserve les deux paliers du passif.

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

    superimposition: null,

    storyDescription: meta ? meta.desc : "",

    passiveName: equipmentBlock.skill_name || (meta ? meta.skillName : "") || "",

    passiveDescription: skillDescs[0] || (meta ? meta.skillDesc : "") || "",
    passiveDescriptionMax: skillDescs[skillDescs.length - 1] || "",
  };
};

module.exports = serializeLightCone;
