// config/hoyolab.js
//
// Utilise l'API publique "rpgcultivate" d'HoYoLab (celle qui alimente le
// Cultivation Tool). Contrairement à l'API game_record classique, celle-ci
// ne nécessite AUCUNE authentification (pas de cookie, pas de header DS) —
// juste l'UID et la région du joueur, exactement comme Mihomo, mais avec
// des données bien plus complètes (roster complet + reliques/cône/traces
// détaillés par personnage).

const BASE_URL = "https://sg-act-public-api.hoyolab.com/event/rpgcultivate";

const buildParams = (uid, region, extra = {}) => {
  const params = new URLSearchParams({
    game: "hkrpg",
    game_biz: "hkrpg_global",
    badge_region: region,
    badge_uid: String(uid),
    ...extra,
  });
  return params.toString();
};

// Ces endpoints n'exigent pas de signature DS, mais vérifient quand même
// qu'une session HoYoLab connectée est associée à la requête (d'où le
// retcode -100 "Please log in" si le Cookie est absent ou périmé).
//
// HoYoverse fait tourner ltoken_v2/cookie_token_v2 fréquemment — le plus
// fiable est donc de coller le header "Cookie" COMPLET tel que Chrome
// l'envoie (DevTools > Network > une requête rpgcultivate > Request
// Headers > Cookie > Copy value), plutôt que de reconstruire cookie par
// cookie à la main (risque d'oublier DEVICEFP, mi18nLang, etc.)
const buildCookieHeader = () => {
  const { HOYOLAB_RAW_COOKIE } = process.env;

  if (!HOYOLAB_RAW_COOKIE) {
    throw new Error(
      "HOYOLAB_RAW_COOKIE manquant dans .env. Colle la valeur complète du " +
        "header Cookie copiée depuis DevTools > Network > une requête " +
        "rpgcultivate > Request Headers > Cookie > Copy value.",
    );
  }

  return HOYOLAB_RAW_COOKIE;
};

const fetchJson = async (url) => {
  const cookieHeader = buildCookieHeader();

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      Referer: "https://act.hoyolab.com/",
      Cookie: cookieHeader,
      "x-rpc-device_fp": "00000000000",
      "x-rpc-device_id": "605e8add-cd74-407a-b94e-f7bc16c93c04",
      "x-rpc-lang": "fr-fr",
      "x-rpc-page": "v4.4.4__#/tools/suggestion",
      "x-rpc-platform": "4",
      "x-rpc-view_source": "1",
    },
  });
  const json = await response.json();
  if (json.retcode !== 0) {
    throw new Error(`HoYoLab API error (retcode ${json.retcode}): ${json.message}`);
  }
  return json.data;
};

/**
 * Récupère la liste COMPLÈTE des personnages du jeu, avec un flag is_own
 * pour distinguer ceux réellement possédés par le joueur. cur_level, rank
 * (éidolons) et damage_type ne sont fiables QUE pour les personnages
 * possédés — pour les autres, ce sont des valeurs par défaut (1, 0...).
 * @param {string|number} uid  UID Star Rail
 * @param {string} region  ex: "prod_official_eur"
 */
const fetchAvatarList = async (uid, region) => {
  const url = `${BASE_URL}/avatar/list?${buildParams(uid, region)}`;
  const data = await fetchJson(url);
  return data.avatars || [];
};

/**
 * Filtre fetchAvatarList pour ne garder que les personnages réellement
 * possédés par le joueur.
 */
const fetchOwnedAvatars = async (uid, region) => {
  const all = await fetchAvatarList(uid, region);
  return all.filter((a) => a.is_own === true);
};

/**
 * Récupère les compositions communautaires suggérées pour un personnage.
 * Nécessaire car avatar/recommend EXIGE un lineup_id valide — sans lui,
 * l'API renvoie systématiquement une erreur générique (-502008), même
 * pour les personnages possédés.
 * @returns {Array} liste de lineups, chacune avec un champ `id`
 */
const fetchLineupRecommends = async (uid, region, itemId) => {
  const extra = { item_id: String(itemId), auto_replace: "true" };
  const url = `${BASE_URL}/lineup/recommends?${buildParams(uid, region, extra)}`;
  const data = await fetchJson(url);
  return data.lineups || [];
};

/**
 * Récupère le détail complet d'un personnage possédé : niveau réel, cône
 * de lumière équipé (avec description de passif), les 6 reliques équipées,
 * et l'arbre de traces/compétences avec niveaux réels.
 *
 * En interne, fait 2 requêtes : d'abord lineup/recommends pour obtenir un
 * lineup_id valide (obligatoire pour avatar/recommend), puis avatar/recommend
 * avec ce lineup_id.
 * @param {string|number} uid  UID Star Rail
 * @param {string} region  ex: "prod_official_eur"
 * @param {string|number} itemId  ID du personnage (ex: 1509 pour Gilgamesh)
 */
const fetchAvatarDetail = async (uid, region, itemId) => {
  const lineups = await fetchLineupRecommends(uid, region, itemId);
  if (lineups.length === 0) {
    throw new Error(
      `Aucune composition communautaire disponible pour item_id ${itemId} — avatar/recommend nécessite un lineup_id.`,
    );
  }
  // Petit délai entre les 2 sous-requêtes — sans lui, elles partaient dos
  // à dos et ça suffisait à déclencher le rate-limit HoYoLab (-500004).
  await new Promise((resolve) => setTimeout(resolve, 200));

  const lineupId = lineups[0].id;
  const extra = { item_id: String(itemId), lineup_id: lineupId };
  const url = `${BASE_URL}/avatar/recommend?${buildParams(uid, region, extra)}`;
  return fetchJson(url);
};

/**
 * Infos générales du compte (pseudo, niveau, etc.)
 */
const fetchUserInfo = async (uid, region) => {
  const url = `${BASE_URL}/user/info?${buildParams(uid, region)}`;
  return fetchJson(url);
};

/**
 * Récupère le profil complet : infos joueur + tous les personnages
 * possédés avec leur détail complet (reliques, cône, traces).
 *
 * ⚠️ Requêtes envoyées EN SÉRIE (pas en parallèle) avec un délai entre
 * chacune — HoYoLab rate-limite agressivement ces endpoints (retcode
 * -500004 "Trop de tentatives") si trop de requêtes arrivent d'un coup.
 * Avec ~70 personnages et 400ms d'espacement, compte ~30s pour un profil
 * complet. Pense à mettre ce résultat en cache côté serveur plutôt que
 * de le refetch à chaque visite.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Codes d'erreur transitoires (surcharge/rate-limit côté HoYoLab) — on
// retente après une pause plutôt que d'abandonner ce personnage.
const isRateLimited = (err) => /-500004|-502008/.test(err.message);

const fetchAvatarDetailWithRetry = async (uid, region, itemId, maxRetries = 3) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fetchAvatarDetail(uid, region, itemId);
    } catch (err) {
      if (!isRateLimited(err) || attempt === maxRetries) throw err;
      await sleep(800 * 2 ** attempt); // 800ms, 1.6s, 3.2s...
    }
  }
};

// Déduplication : si deux appels arrivent en même temps pour le même
// UID+région (ex: StrictMode qui exécute useEffect deux fois en dev, ou
// double-clic sur "Rechercher"), on partage la même requête au lieu de
// lancer deux pipelines en parallèle — ce qui double le rythme de
// requêtes vers HoYoLab et redéclenche le rate-limit.
const inFlightProfiles = new Map();
const inFlightBaseProfiles = new Map();
const baseProfileCache = new Map();
const BASE_PROFILE_CACHE_MS = 30_000;

const fetchBaseProfile = async (uid, region) => {
  const key = `${uid}:${region}`;
  const cached = baseProfileCache.get(key);
  if (cached && Date.now() - cached.createdAt < BASE_PROFILE_CACHE_MS) {
    return cached.value;
  }
  if (inFlightBaseProfiles.has(key)) return inFlightBaseProfiles.get(key);

  const promise = Promise.all([
    fetchUserInfo(uid, region),
    fetchOwnedAvatars(uid, region),
  ]).then(([userInfo, ownedAvatars]) => {
    const value = { userInfo, ownedAvatars };
    baseProfileCache.set(key, { createdAt: Date.now(), value });
    return value;
  });

  inFlightBaseProfiles.set(key, promise);
  try {
    return await promise;
  } finally {
    inFlightBaseProfiles.delete(key);
  }
};

const fetchFullProfile = async (uid, region, { delayMs = 300 } = {}) => {
  const key = `${uid}:${region}`;
  if (inFlightProfiles.has(key)) {
    return inFlightProfiles.get(key);
  }

  const promise = (async () => {
    const { userInfo, ownedAvatars } = await fetchBaseProfile(uid, region);

    const characters = [];
    for (const avatar of ownedAvatars) {
      try {
        const detail = await fetchAvatarDetailWithRetry(uid, region, avatar.item_id);
        characters.push({ basic: avatar, detail });
      } catch (err) {
        console.warn(
          `⚠️  Détail indisponible pour ${avatar.item_name} (${avatar.item_id}): ${err.message}`,
        );
        characters.push({ basic: avatar, detail: null });
      }
      await sleep(delayMs);
    }

    return { userInfo, characters };
  })();

  inFlightProfiles.set(key, promise);
  try {
    return await promise;
  } finally {
    inFlightProfiles.delete(key);
  }
};

module.exports = {
  fetchAvatarList,
  fetchOwnedAvatars,
  fetchAvatarDetail,
  fetchAvatarDetailWithRetry,
  fetchUserInfo,
  fetchFullProfile,
  fetchBaseProfile,
};
