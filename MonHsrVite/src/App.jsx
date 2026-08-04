// ⚠️ Deux changements liés au backend :
// 1. La région est désormais requise (voir SearchBox.jsx) — l'API
//    HoYoLab en a besoin, contrairement à Mihomo.
// 2. L'appel pointe vers la route hoyolab-full (à créer/adapter dans
//    routes/api.js si ce n'est pas déjà fait — voir getUserData qui
//    prend maintenant (userId, region, language)).
// 3. Le chargement peut prendre 30-60s pour un roster complet (rate-limit
//    HoYoLab côté backend) — le spinner Bulma existant couvre déjà ce cas,
//    mais un message d'attente explicite a été ajouté pour éviter que
//    l'utilisateur pense l'app plantée.

import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import SearchBox from "./components/SearchBox";
import CharacterList from "./components/characterComp/CharacterList";
import CharacterDetails from "./components/characterComp/CharacterDetails";
import BottomSection from "./components/bottomSection/BottomSection";

const languages = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "de", name: "Deutsch" },
];

// Codes serveur standards Star Rail (global) — à ajuster si besoin.
const regions = [
  { code: "prod_official_eur", name: "Europe" },
  { code: "prod_official_usa", name: "Amérique" },
  { code: "prod_official_asia", name: "Asie" },
  { code: "prod_official_cht", name: "TW/HK/MO" },
];

function App() {
  const [userId, setUserId] = useState("701536690");
  const [region, setRegion] = useState("prod_official_eur");
  const [language, setLanguage] = useState("fr");
  const [profile, setProfile] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeCharacter = useMemo(
    () => profile?.characterList?.[selectedIndex] || null,
    [profile, selectedIndex],
  );

  const loadProfile = useCallback(
    async (uid = userId, reg = region, lang = language) => {
      if (!uid.trim()) {
        setError("Veuillez entrer un UID valide");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:5000/api/user/${uid}/hoyolab-full?region=${reg}&language=${lang}`,
        );
        if (!response.ok) throw new Error("Profil introuvable ou erreur API");
        const data = await response.json();
        setProfile(data);
        setSelectedIndex(0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [userId, region, language],
  );

  useEffect(() => {
    if (!userId.trim()) return;
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <section className="hero is-dark is-small app-banner">
        <div className="hero-body">
          <div className="container has-text-centered-mobile">
            <h1 className="title is-3 font-orbitron has-text-gold mb-1">
              <i className="fa-solid fa-arrow-trend-up mr-2"></i>ASTRAL DATABASE
            </h1>
            <p className="subtitle is-6 has-text-grey-light mt-2">Honkai Star Rail Showcase Viewer</p>
          </div>
        </div>
      </section>

      <SearchBox
        userId={userId}
        setUserId={setUserId}
        region={region}
        setRegion={setRegion}
        regions={regions}
        language={language}
        setLanguage={setLanguage}
        languages={languages}
        loading={loading}
        onSearch={() => loadProfile()}
      />

      <section className="section pt-2">
        <div className="container">
          {error && (
            <div className="notification is-danger font-orbitron">
              <button className="delete" onClick={() => setError(null)} />
              {error}
            </div>
          )}

          {loading && (
            <div className="notification is-info is-light font-orbitron">
              Récupération du profil complet en cours — ça peut prendre jusqu'à une minute pour un gros roster.
            </div>
          )}

          {profile && !loading && (
            <>
              <div className="columns">
                <CharacterList profile={profile} selectedIndex={selectedIndex} onSelectCharacter={setSelectedIndex} />
                <CharacterDetails activeCharacter={activeCharacter} />
              </div>

              <BottomSection activeCharacter={activeCharacter} />
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
