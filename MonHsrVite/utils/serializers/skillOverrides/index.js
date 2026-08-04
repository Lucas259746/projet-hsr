// utils/serializers/skillOverrides/index.js
//
// Fusionne tous les fichiers d'override par personnage en un seul
// dictionnaire plat { [point_id]: { name, description } }.
//
// Pour ajouter un nouveau personnage : crée un fichier
// {avatarId}-{nom}.js sur le modèle de 1509-gilgamesh.js, puis importe-le
// et ajoute-le au spread ci-dessous.

const gilgamesh1509 = require("./1509-gilgamesh");
// const himeko1510 = require("./1510-himeko-nova");
// const acheron1308 = require("./1308-acheron");
// ... ajoute au fur et à mesure

const ALL_OVERRIDES = {
  ...gilgamesh1509,
  // ...himeko1510,
  // ...acheron1308,
};

/**
 * Cherche un override manuel par point_id. Retourne null si absent —
 * le resolver retombera alors sur le cache Mar-7th.
 */
const getOverride = (pointId) => {
  if (!pointId) return null;
  return ALL_OVERRIDES[String(pointId)] || null;
};

module.exports = { getOverride };
