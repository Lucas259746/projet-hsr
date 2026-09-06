// Sérialise les reliques HoYoLab, dont les valeurs détaillées sont limitées.

const RELIC_SLOT_LABELS = {
  HEAD: "Tête",
  HAND: "Main",
  BODY: "Corps",
  FOOT: "Pied",
  SIDEBALL: "Sphère",
  ROPE: "Corde",
};

/**
 * @param {object} relic  une entrée de detail.relics_v2.dress_relics
 */
const serializeRelic = (relic) => {
  if (!relic) return null;

  return {
    id: relic.item_id ? String(relic.item_id) : null,
    name: relic.item_name || null,
    iconUrl: relic.icon_url || null,
    type: RELIC_SLOT_LABELS[relic.body_type] || relic.body_type || "Slot inconnu",
    setId: relic.set_id ? String(relic.set_id) : null,
    set: relic.set_name || null,
    level: relic.level != null ? Number(relic.level) : null,
    rarity: relic.rarity != null ? Number(relic.rarity) : null,

    mainStat: relic.main_property_name
      ? { property: relic.main_property_name, value: null, isPercent: null }
      : null,

    subStats: [],
  };
};

/**
 * Extrait les bonus de set à partir des reliques équipées.
 * @param {Array} dressRelics  detail.relics_v2.dress_relics
 */
const extractRelicSets = (dressRelics) => {
  if (!dressRelics?.length) return [];

  const bySet = {};
  for (const relic of dressRelics) {
    if (!relic.set_id) continue;
    if (!bySet[relic.set_id]) {
      bySet[relic.set_id] = {
        id: String(relic.set_id),
        name: relic.set_name || null,
        count: 0,
        twoDesc: relic.set_two_desc || "",
        fourDesc: relic.set_four_desc || "",
      };
    }
    bySet[relic.set_id].count += 1;
  }

  const result = [];
  for (const set of Object.values(bySet)) {
    if (set.count >= 2 && set.twoDesc) {
      result.push({ id: set.id, name: set.name, num: 2, desc: set.twoDesc, properties: [] });
    }
    if (set.count >= 4 && set.fourDesc) {
      result.push({ id: set.id, name: set.name, num: 4, desc: set.fourDesc, properties: [] });
    }
  }
  return result;
};

module.exports = serializeRelic;
module.exports.extractRelicSets = extractRelicSets;
