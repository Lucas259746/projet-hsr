// Regroupe les corrections de texte manuelles par personnage.

const gilgamesh1509 = require("./1509-gilgamesh");

const ALL_OVERRIDES = {
  ...gilgamesh1509,
};

/**
 * Retourne la correction associée à un point_id, ou null si absente.
 */
const getOverride = (pointId) => {
  if (!pointId) return null;
  return ALL_OVERRIDES[String(pointId)] || null;
};

module.exports = { getOverride };
