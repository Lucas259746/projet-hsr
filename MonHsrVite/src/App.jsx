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

// Codes de serveur attendus par l'API HoYoLab.
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
  const [detailsLoading, setDetailsLoading] = useState(false);
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
        const rosterResponse = await fetch(
          `http://localhost:5000/api/user/${uid}/hoyolab-roster?region=${reg}`,
        );
        if (!rosterResponse.ok) throw new Error("Profil introuvable ou erreur API");
        setProfile(await rosterResponse.json());
        setSelectedIndex(0);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setDetailsLoading(false);
      } finally {
        setLoading(false);
      }
    },
    [userId, region, language],
  );

  useEffect(() => {
    if (!profile || !activeCharacter?.id || activeCharacter.detailsLoaded) return undefined;

    let cancelled = false;
    setDetailsLoading(true);
    fetch(
      `http://localhost:5000/api/user/${userId}/character/${activeCharacter.id}?region=${region}&language=${language}`,
    )
      .then((response) => {
        if (!response.ok) throw new Error("Impossible de charger les détails du personnage");
        return response.json();
      })
      .then((details) => {
        if (cancelled) return;
        setProfile((currentProfile) => {
          if (!currentProfile) return currentProfile;
          const characterList = currentProfile.characterList.map((character) =>
            character.id === details.id ? { ...details, detailsLoaded: true } : character,
          );
          return { ...currentProfile, characterList };
        });
      })
      .catch((detailsError) => {
        if (!cancelled) console.error("Character details request failed:", detailsError);
      })
      .finally(() => {
        if (!cancelled) setDetailsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeCharacter, language, profile, region, userId]);

  useEffect(() => {
    if (!userId.trim()) return;
    const timeoutId = window.setTimeout(() => {
      loadProfile();
    }, 0);

    return () => window.clearTimeout(timeoutId);
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
              Récupération de la liste des personnages en cours...
            </div>
          )}

          {detailsLoading && profile && (
            <div className="notification is-info is-light font-orbitron">
              La liste est disponible; chargement des cônes, reliques et compétences en cours...
            </div>
          )}

          {profile && (
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
