// config/relicCache.js
//
// Enka.Network donne les valeurs de stats déjà calculées pour les
// reliques, mais seulement des IDs numériques pour les noms (relic.tid,
// _flat.setID) — pas de texte. Ce cache résout ces IDs vers du texte
// lisible via Mar-7th/StarRailRes, avec le même filet de sécurité que
// characterSkillCache.js : échec silencieux, jamais de crash serveur.

const BASE_URL = "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_min";

let relicCache = {}; // { [tid]: { name, setId, rarity } }
let relicSetCache = {}; // { [setId]: { name, twoPieceDesc, fourPieceDesc } }
let lastFetchTime = 0;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const fetchJson = async (url) => {
  const res = await fetch(url, { headers: { "User-Agent": "AstralDatabase/1.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
};

/**
 * Charge (ou recharge) les caches de reliques/sets. Ne lève jamais
 * d'erreur — en cas d'échec, les caches restent vides ou inchangés et
 * les reliques Enka retombent sur un affichage sans nom (ID brut).
 */
const loadCache = async (language = "en") => {
  const now = Date.now();
  if (
    (Object.keys(relicCache).length > 0 || Object.keys(relicSetCache).length > 0) &&
    now - lastFetchTime < CACHE_TTL_MS
  ) {
    return;
  }

  try {
    const [relicsData, setsData] = await Promise.all([
      fetchJson(`${BASE_URL}/${language}/relics.json`),
      fetchJson(`${BASE_URL}/${language}/relic_sets.json`),
    ]);

    relicCache = relicsData || {};
    relicSetCache = setsData || {};
    lastFetchTime = now;

    console.log(
      `✅ Relic cache loaded: ${Object.keys(relicCache).length} relics, ` +
        `${Object.keys(relicSetCache).length} sets (lang: ${language})`,
    );
  } catch (err) {
    console.warn(`⚠️  Relic cache load failed (${err.message}). Reliques Enka affichées sans nom.`);
  }
};

const getRelicMeta = (tid) => (tid ? relicCache[String(tid)] || null : null);
const getRelicSetMeta = (setId) => (setId ? relicSetCache[String(setId)] || null : null);

module.exports = { loadCache, getRelicMeta, getRelicSetMeta };
