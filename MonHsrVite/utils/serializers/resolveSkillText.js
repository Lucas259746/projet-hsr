// Résout les textes des compétences et des nœuds de l'arbre de traces.
// La priorité est : override manuel, arbre de traces, puis cache des skills.

const { getOverride } = require("./skillOverrides");
const {
  getSkillTreeMeta,
  getSkillMeta,
} = require("../../config/characterSkillCache");

const ICON_BASE_URL = "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/";
const resolveIconUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${ICON_BASE_URL}${path}`;
};

const hasText = (entry) => !!(entry && (entry.name || entry.desc));

const formatResolvedEntry = (entry, iconPath) => ({
  name: entry?.name || null,
  description: entry?.desc || null,
  icon: resolveIconUrl(iconPath || entry?.icon),
});

const SHORT_STAT_LABELS = [
  [/points? de vie|pv/i, "PV"],
  [/attaque|atk/i, "ATQ"],
  [/défense|defense|def/i, "DÉF"],
  [/vitesse|speed|vit/i, "VIT"],
  [/chance.*critique|taux.*critique|coup critique/i, "Taux crit"],
  [/dégâts? critiques?|degats? critiques?|dgt critiques?/i, "DGT crit"],
  [/chances? d'effet|taux d'effet/i, "Chance effet"],
  [/(?:résistance?|res)\s+(?:aux\s+)?effets/i, "RES effets"],
  [/effet de rupture/i, "Rupture"],
  [/taux de soin/i, "Soin"],
  [/régénération? d'énergie|regeneration? d'énergie/i, "Énergie"],
  [
    /bonus (?:dégâts?|dgt) (physique|feu|glace|foudre|vent|quantique|imaginaire)/i,
    (_, element) => `DGT ${element}`,
  ],
];

const shortenStatLabel = (value) => {
  if (!value) return value;
  const label = String(value).replace(/<[^>]+>/g, "").trim();
  const match = SHORT_STAT_LABELS.find(([pattern]) => pattern.test(label));
  if (!match) return label;
  return typeof match[1] === "function" ? label.replace(match[0], match[1]) : match[1];
};

/**
 * @param {string} pointId Identifiant brut HoYoLab ou Enka.
 * @param {"skill"|"tree"} kind Indique le type de donnée attendu dans les logs.
 * @returns {{ name: string|null, description: string|null, icon: string|null }}
 */
const resolveSkillText = (pointId, kind = "tree") => {
  const override = getOverride(pointId);
  if (override) return formatResolvedEntry({ name: override.name, desc: override.description }, override.icon);

  const treeEntry = getSkillTreeMeta(pointId);

  // Cas aptitude principale : name/desc vides, mais level_up_skills
  // pointe vers le vrai skill dans character_skills.json.
  if (treeEntry?.level_up_skills?.length) {
    const realSkillId = treeEntry.level_up_skills[0].id;
    const skillEntry = getSkillMeta(realSkillId);
    if (hasText(skillEntry)) return formatResolvedEntry(skillEntry, treeEntry.icon);
  }

  if (hasText(treeEntry)) return formatResolvedEntry(treeEntry);

  const skillEntry = getSkillMeta(pointId);
  if (hasText(skillEntry)) return formatResolvedEntry(skillEntry);

  console.warn(
    `⚠️  resolveSkillText: aucune correspondance pour point_id=${pointId} (kind=${kind})`,
  );
  return {
    name: null,
    description: null,
    icon: treeEntry ? resolveIconUrl(treeEntry.icon) : null,
  };
};

module.exports = { resolveSkillText, shortenStatLabel };
