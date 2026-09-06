// Récupère les données publiques de la vitrine Enka.Network.
// config/enkaNetwork.js
//
// Enka.Network expose la VITRINE HoYoLab (comme Mihomo, mais toujours en
// ligne) avec des données bien plus riches que l'endpoint rpgcultivate :
// substats de reliques calculés, superposition de cône, et l'arbre de
// traces COMPLET (19-20 points par perso, dont la Technique).
//
// Limite : uniquement les persos de la vitrine (5-8 en général), pas le
// roster complet. On l'utilise donc en ENRICHISSEMENT — le roster complet
// vient toujours de config/hoyolab.js, et ces données viennent combler
// les trous pour les persos présents dans la vitrine.

const BASE_URL = "https://enka.network/api/hsr/uid";
const TIMEOUT_MS = 5000; // si Enka met plus de 5s à répondre, on abandonne plutôt que de bloquer tout le profil

/**
 * Récupère la vitrine complète d'un joueur depuis Enka.Network.
 * Ne lève JAMAIS d'erreur — retourne un tableau vide dans tous les cas
 * d'échec (vitrine fermée, compte inexistant, service down, timeout...).
 * Le reste du site (roster HoYoLab complet) continue de fonctionner
 * intégralement même si Enka disparaît demain — c'est une pure couche
 * d'enrichissement, jamais une dépendance bloquante.
 *
 * Désactivable entièrement via .env : ENABLE_ENKA_ENRICHMENT=false
 *
 * @param {string|number} uid
 * @returns {Promise<Array>} avatarDetailList (peut être vide)
 */
const fetchEnkaShowcase = async (uid) => {
  if (process.env.ENABLE_ENKA_ENRICHMENT === "false") {
    return [];
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${BASE_URL}/${uid}/`, {
      headers: { "User-Agent": "AstralDatabase/1.0 (contact: github issues)" },
      signal: controller.signal,
    });

    if (!response.ok) {
      console.warn(`⚠️  Enka.Network indisponible (HTTP ${response.status}) pour UID ${uid} — profil servi sans enrichissement.`);
      return [];
    }

    const json = await response.json();
    return json?.detailInfo?.avatarDetailList || [];
  } catch (err) {
    const reason = err.name === "AbortError" ? "timeout" : err.message;
    console.warn(`⚠️  Enka.Network fetch échoué pour UID ${uid} (${reason}) — profil servi sans enrichissement.`);
    return [];
  } finally {
    clearTimeout(timeout);
  }
};

module.exports = { fetchEnkaShowcase };
