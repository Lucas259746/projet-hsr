// utils/serializers/sumStats.js
//
// ⚠️ GAP CONNU : avatar_property_v2 ne donne que 3-4 stats "mises en
// avant" pour ce personnage précis (souvent VIT/Crit Rate/Crit DMG/ATQ,
// mais ça varie), jamais la feuille complète (PV, DÉF, RES effets,
// bonus élémentaire...) que Mihomo fournissait. On sérialise ce qui est
// là ; le frontend (CharacterStats.jsx) affiche déjà "Aucune statistique
// disponible." si le tableau est vide, donc pas de crash — juste moins
// d'infos qu'avant.
//
// Structure source : avatar_property_v2 est un tableau de "paliers"
// (Level1/2/3 — sens exact incertain, possiblement liés aux paliers de
// surimposition du cône). On prend le DERNIER palier (index le plus
// élevé) en supposant que c'est l'état actuel le plus abouti — à vérifier.

const serializeStats = (avatarPropertyV2) => {
  if (!avatarPropertyV2?.length) return [];

  // Dernier palier = a priori le plus représentatif de l'état actuel
  const latestTier = avatarPropertyV2[avatarPropertyV2.length - 1];
  const values = latestTier?.values || [];

  return values.map((stat) => ({
    key: stat.id != null ? String(stat.id) : stat.name,
    name: stat.name || null,
    total: stat.cur_num_display || (stat.cur_num != null ? String(stat.cur_num) : null),
    // Pas de décomposition base/bonus disponible dans cette API
    base: null,
    bonus: null,
    isPercent: !!stat.is_percent,
  }));
};

module.exports = serializeStats;
