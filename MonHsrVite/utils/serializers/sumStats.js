// Sérialise les statistiques mises en avant par HoYoLab.

const serializeStats = (avatarPropertyV2) => {
  if (!avatarPropertyV2?.length) return [];

  // Le dernier palier contient les valeurs les plus récentes.
  const latestTier = avatarPropertyV2[avatarPropertyV2.length - 1];
  const values = latestTier?.values || [];

  return values.map((stat) => ({
    key: stat.id != null ? String(stat.id) : stat.name,
    name: stat.name || null,
    total: stat.cur_num_display || (stat.cur_num != null ? String(stat.cur_num) : null),
    base: null,
    bonus: null,
    isPercent: !!stat.is_percent,
  }));
};

module.exports = serializeStats;
