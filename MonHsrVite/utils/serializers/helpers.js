// Fonctions de normalisation partagées par les sérialiseurs.

const getText = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return null;
};

const HOYOLAB_ASSET_BASE = "https://act-webstatic.hoyoverse.com/";
const normalizeImageAsset = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${HOYOLAB_ASSET_BASE}${path}`;
};

// Retire les variantes de texte dépendantes du genre du personnage.
const sanitizeGenderTag = (text) => {
  if (!text) return null;
  return String(text)
    .replace(/\{F#([^}]*)\}\{M#[^}]*\}/gi, "$1")
    .replace(/\{M#([^}]*)\}\{F#[^}]*\}/gi, "$1")
    .replace(/\{[FM]#([^}]*)\}/gi, "$1")
    .trim();
};

// Traduit le code numérique de voie renvoyé par HoYoLab.
const PATH_MAP = {
  1: "La Destruction",
  2: "La Chasse",
  3: "L'Érudition",
  4: "L'Harmonie",
  5: "La Nihilité",
  6: "La Préservation",
  7: "L'Abondance",
  8: "Le Souvenir",
  9: "L'Allégresse",
};

const getPathName = (avatarBaseType) => PATH_MAP[Number(avatarBaseType)] || null;

// Traduit le bitmask d'élément renvoyé par HoYoLab.
const ELEMENT_MAP = {
  1: "Physique",
  2: "Feu",
  4: "Glace",
  8: "Foudre",
  16: "Vent",
  32: "Quantique",
  64: "Imaginaire",
};

const getElementName = (damageType) => ELEMENT_MAP[Number(damageType)] || null;

// Déduit l'ascension à partir des paliers de niveau standards.
const getAscensionFromLevel = (level) => {
  const lvl = Number(level) || 0;
  if (lvl >= 80) return 6;
  if (lvl >= 70) return 5;
  if (lvl >= 60) return 4;
  if (lvl >= 50) return 3;
  if (lvl >= 40) return 2;
  if (lvl >= 30) return 1;
  return 0;
};

module.exports = {
  getText,
  normalizeImageAsset,
  sanitizeGenderTag,
  getPathName,
  getElementName,
  getAscensionFromLevel,
};
