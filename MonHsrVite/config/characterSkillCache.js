// Charge et met en cache les textes des compétences.
// config/characterSkillCache.js
//
// Charge les descriptions textuelles des compétences et traces depuis
// Mar-7th/StarRailRes — la même source communautaire que lightConeCache.js
// utilise déjà. L'API HoYoLab "rpgcultivate" donne les niveaux/statuts
// réels mais AUCUNE description de compétence — ce cache comble ce trou.
//
// ⚠️ Dépendance externe non-officielle : si Mar-7th arrête de maintenir
// ce dépôt ou que sa structure change, ce module échoue silencieusement
// (log d'avertissement, cache vide) plutôt que de faire planter le
// serveur. Voir utils/serializers/skillOverrides/ pour ajouter des
// descriptions manuellement en attendant, ou définitivement pour les
// personnages qui ne seraient jamais mis à jour par Mar-7th.

const BASE_URL =
  "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_min";

let skillCache = {}; // { [skillId]: { name, desc } }
let skillTreeCache = {}; // { [pointId]: { name, desc } }
let lastFetchTime = 0;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h, comme lightConeCache.js

const fetchJson = async (url) => {
  const res = await fetch(url, {
    headers: { "User-Agent": "AstralDatabase/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
};

/**
 * Charge (ou recharge) les caches de compétences et traces pour une langue.
 * Ne lève JAMAIS d'erreur — en cas d'échec (dépôt down, structure changée,
 * fichier renommé...), les caches restent vides et le résolveur retombe
 * sur les overrides manuels ou une description vide.
 * @param {string} language  ex: "en", "fr", "de"
 */
const loadCache = async (language = "en") => {
  const now = Date.now();
  if (
    (Object.keys(skillCache).length > 0 ||
      Object.keys(skillTreeCache).length > 0) &&
    now - lastFetchTime < CACHE_TTL_MS
  ) {
    return; // cache encore valide
  }

  try {
    const [skillsData, skillTreesData] = await Promise.all([
      fetchJson(`${BASE_URL}/${language}/character_skills.json`),
      fetchJson(`${BASE_URL}/${language}/character_skill_trees.json`),
    ]);

    // Les deux fichiers sont des objets { [id]: {...} } dans index_min
    skillCache = skillsData || {};
    skillTreeCache = skillTreesData || {};
    lastFetchTime = now;

    console.log(
      `✅ CharacterSkill cache loaded: ${Object.keys(skillCache).length} skills, ` +
        `${Object.keys(skillTreeCache).length} traces (lang: ${language})`,
    );
  } catch (err) {
    console.warn(
      `⚠️  CharacterSkill cache load failed (${err.message}). ` +
        `Descriptions viendront uniquement des overrides manuels (utils/serializers/skillOverrides/), ` +
        `ou seront absentes.`,
    );
    // On ne jette rien — skillCache/skillTreeCache restent tels quels
    // (potentiellement vides, ou l'ancien cache encore valide en mémoire)
  }
};

/**
 * Cherche la description d'un point d'arbre (trace) ou d'une compétence
 * principale par son ID brut HoYoLab (point_id). Retourne null si absent
 * du cache — à combiner avec les overrides manuels avant d'afficher.
 * @param {string} id  point_id tel que fourni par l'API HoYoLab
 */
const getSkillTreeMeta = (id) => {
  if (!id) return null;
  return skillTreeCache[String(id)] || null;
};

const getSkillMeta = (id) => {
  if (!id) return null;
  return skillCache[String(id)] || null;
};

module.exports = { loadCache, getSkillTreeMeta, getSkillMeta };
