// utils/serializers/index.js

const {
  fetchFullProfile,
  fetchBaseProfile,
  fetchAvatarDetailWithRetry,
} = require("../../config/hoyolab");
const { fetchEnkaShowcase } = require("../../config/enkaNetwork");
const { loadCache: loadLightConeCache } = require("../../config/lightConeCache");
const { loadCache: loadSkillCache } = require("../../config/characterSkillCache");
const { loadCache: loadRelicCache } = require("../../config/relicCache");
const serializeCharacter = require("./character");
const { mergeEnkaIntoCharacter } = require("./enkaEnrich");

/**
 * Récupère et nettoie le profil complet d'un joueur.
 *
 * @param {string} userId  UID Star Rail
 * @param {string} region Code de serveur HoYoLab.
 * @param {string} language Langue utilisée par les caches de texte.
 */
const getUserData = async (userId, region, language = "fr") => {
  try {
    // Un cache indisponible ne doit pas bloquer les autres sources.
    await Promise.allSettled([
      loadLightConeCache(language),
      loadSkillCache(language),
      loadRelicCache(language),
    ]);

    const [profile, enkaShowcase] = await Promise.all([
      fetchFullProfile(userId, region),
      fetchEnkaShowcase(userId),
    ]);
    const { userInfo, characters } = profile;

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

const getUserRoster = async (userId, region) => {
  const { userInfo, ownedAvatars } = await fetchBaseProfile(userId, region);
  const characterList = ownedAvatars
    .map((basic) => serializeCharacter({ basic, detail: null }))
    .filter(Boolean);

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
};

const getCharacterData = async (userId, region, itemId, language = "fr") => {
  await Promise.allSettled([
    loadLightConeCache(language),
    loadSkillCache(language),
    loadRelicCache(language),
  ]);

  const { ownedAvatars } = await fetchBaseProfile(userId, region);
  const basic = ownedAvatars.find((avatar) => String(avatar.item_id) === String(itemId));
  if (!basic) throw new Error(`Personnage ${itemId} introuvable dans le roster`);

  const [detail, enkaShowcase] = await Promise.all([
    fetchAvatarDetailWithRetry(userId, region, itemId),
    fetchEnkaShowcase(userId),
  ]);
  const enkaDetail = enkaShowcase.find((entry) => String(entry.avatarId) === String(itemId));
  return mergeEnkaIntoCharacter(
    serializeCharacter({ basic, detail }),
    enkaDetail,
  );
};

module.exports = { getUserData, getUserRoster, getCharacterData };
