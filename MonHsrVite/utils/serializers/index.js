// utils/serializers/index.js

const { fetchFullProfile } = require("../../config/hoyolab");
const { fetchEnkaShowcase } = require("../../config/enkaNetwork");
const { loadCache: loadLightConeCache } = require("../../config/lightConeCache");
const { loadCache: loadSkillCache } = require("../../config/characterSkillCache");
const { loadCache: loadRelicCache } = require("../../config/relicCache");
const serializeCharacter = require("./character");
const { mergeEnkaIntoCharacter } = require("./enkaEnrich");

/**
 * Fonction principale : récupère et nettoie le profil complet d'un joueur
 * à partir de l'API HoYoLab (roster + détail par personnage possédé).
 *
 * ⚠️ Peut prendre 30-60s pour un roster complet (l'API HoYoLab impose un
 * rate-limit strict — voir config/hoyolab.js). Pense à mettre ce résultat
 * en cache côté serveur (Redis, fichier, etc.) plutôt que de le refetch
 * à chaque requête entrante.
 *
 * @param {string} userId  UID Star Rail
 * @param {string} region  ex: "prod_official_eur" (requis, contrairement
 *   à Mihomo qui n'avait besoin que de la langue)
 * @param {string} language  ex: "fr" — utilisé pour les caches Mar-7th
 */
const getUserData = async (userId, region, language = "fr") => {
  try {
    // Charge les caches externes (Mar-7th) en parallèle — chacun échoue
    // silencieusement de son côté si indisponible (voir leurs fichiers
    // respectifs), donc pas de Promise.all qui casserait tout en cas
    // d'échec d'un seul.
    await Promise.allSettled([
      loadLightConeCache(language),
      loadSkillCache(language),
      loadRelicCache(language),
    ]);

    // fetchEnkaShowcase() est déjà 100% résiliente (voir config/enkaNetwork.js)
    // — jamais d'erreur, jamais de blocage, tableau vide si indisponible.
    const [profile, enkaShowcase] = await Promise.all([
      fetchFullProfile(userId, region),
      fetchEnkaShowcase(userId),
    ]);
    const { userInfo, characters } = profile;

    // Index rapide par avatarId pour la fusion
    const enkaByAvatarId = {};
    for (const detail of enkaShowcase) {
      enkaByAvatarId[String(detail.avatarId)] = detail;
    }

    const characterList = characters
      .map(serializeCharacter)
      .filter(Boolean)
      .map((char) => mergeEnkaIntoCharacter(char, enkaByAvatarId[char.id]));

    return {
      uid: String(userId),
      nickname: userInfo?.nickname || "Joueur",
      level: userInfo?.level != null ? Number(userInfo.level) : null,
      worldLevel: null,
      characterCount: characterList.length,
      lightConeCount: null,
      relicCount: null,
      characterList,
    };
  } catch (error) {
    console.error(`❌ Error fetching user ${userId}:`, error.message);
    throw error;
  }
};

module.exports = { getUserData };
