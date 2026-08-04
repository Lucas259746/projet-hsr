// utils/serializers/helpers.js
//
// L'API HoYoLab renvoie déjà des URLs d'images absolues (contrairement à
// Mihomo qui donnait des chemins relatifs) — normalizeImageAsset n'est
// donc plus nécessaire, on la garde en passthrough par sécurité si un
// champ imprévu contient encore un chemin relatif.

const getText = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return null;
};

// Passthrough de sécurité — HoYoLab donne des URLs absolues partout,
// mais on garde ce filet au cas où un champ imprévu ne le serait pas.
const HOYOLAB_ASSET_BASE = "https://act-webstatic.hoyoverse.com/";
const normalizeImageAsset = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${HOYOLAB_ASSET_BASE}${path}`;
};

// Nettoie les balises de genre {F#...}{M#...} présentes dans certains
// textes du jeu (noms/descriptions dépendant du genre du Pionnier).
const sanitizeGenderTag = (text) => {
  if (!text) return null;
  return String(text)
    .replace(/\{F#([^}]*)\}\{M#[^}]*\}/gi, "$1")
    .replace(/\{M#([^}]*)\}\{F#[^}]*\}/gi, "$1")
    .replace(/\{[FM]#([^}]*)\}/gi, "$1")
    .trim();
};

// ── Voie (avatar_base_type) ──
// L'API ne donne qu'un code numérique 1-9, jamais le nom — confirmé en
// croisant plusieurs personnages connus (Gilgamesh=1=Destruction,
// Seele=2=Chasse, Himeko=3=Érudition, Sunday=4=Harmonie, Kafka=5=Nihilité,
// Fu Xuan=6=Préservation, Huohuo=7=Abondance, Castorice=8=Souvenir).
// La voie 9 (Allégresse) est déduite par élimination sur les personnages
// IPC (Sparxie, Yao Guang...) — moins de certitude, à vérifier si un
// personnage semble mal classé.
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

// ── Élément (damage_type) ──
// Bitmask standard HSR (puissances de 2), confirmé sur ~40 personnages
// connus de la réponse avatar/list.
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

// ── Ascension ──
// Non fournie explicitement par l'API (seulement cur_level/max_level).
// Déduite des paliers standards du jeu — fiable car ce système ne change
// jamais entre personnages.
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
