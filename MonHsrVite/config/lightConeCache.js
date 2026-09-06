// Charge et met en cache les textes des cônes de lumière.
// config/lightConeCache.js
//
// Charge au démarrage les descriptions des light cones depuis le dépôt statique
// Mar-7th/StarRailRes — la même source que Mihomo utilise en interne.
// Les données sont mises en cache en mémoire, avec un rafraîchissement toutes les 24h.

const BASE_URL =
  "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_min";

// Cache en mémoire : { [id]: { desc, effect_name, effect_desc } }
let cache = {};
let lastFetchTime = 0;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

/**
 * Récupère un JSON depuis une URL avec fetch natif.
 */
const fetchJson = async (url) => {
  const res = await fetch(url, {
    headers: { "User-Agent": "AstralDatabase/1.0" },
  });
  console.log(`Fetching JSON from ${url}... Status: ${res.status}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
};

/**
 * Charge (ou recharge) le cache des light cones pour une langue donnée.
 * Le cache contient uniquement les champs utiles à l'affichage.
 * @param {string} language  ex: "en", "fr", "de"…
 */
const loadCache = async (language = "en") => {
  const now = Date.now();
  if (Object.keys(cache).length > 0 && now - lastFetchTime < CACHE_TTL_MS) {
    return; // cache encore valide
  }

  try {
    // Mar-7th expose les light cones sous : /index_min/{lang}/light_cones.json
    // Chaque entrée : { id, name, rarity, path, desc, icon, preview, portrait, skill: { name, desc } }
    const url = `${BASE_URL}/${language}/light_cones.json`;
    const data = await fetchJson(url);

    // data est un objet { [id]: { ... } } ou un tableau selon la version
    const entries = Array.isArray(data) ? data : Object.values(data);

    // Dans config/lightConeCache.js
    const newCache = {};
    for (const lc of entries) {
      if (!lc.id) continue;

      // DEBUG : Décommentez la ligne ci-dessous pour voir la structure réelle dans votre console
      // console.log(`Données brutes pour LC ${lc.id}:`, lc);

      newCache[String(lc.id)] = {
        desc: lc.desc || "", // Histoire
        skillName: lc.skill?.name || "", // Nom du passif
        skillDesc: lc.skill?.desc || "", // Description du passif
      };
    }
    cache = newCache;
    lastFetchTime = now;
    console.log(
      `✅ LightCone cache loaded: ${Object.keys(cache).length} entries (lang: ${language})`,
    );
  } catch (err) {
    console.warn(
      `⚠️  LightCone cache load failed (${err.message}). Descriptions will be empty.`,
    );
    // On ne plante pas le serveur — les descriptions seront juste absentes
  }
};

/**
 * Retourne les métadonnées d'un light cone par son ID.
 * @param {string|number} id
 * @returns {{ desc, skillName, skillDesc } | null}
 */
const getLightConeMeta = (id) => {
  if (!id) return null;
  return cache[String(id)] || null;
};

module.exports = { loadCache, getLightConeMeta };
