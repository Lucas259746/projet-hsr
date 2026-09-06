// Affiche les détails du personnage actuellement sélectionné.
import LightConeCard from "../lightConeComp/LightConeCard";
import useCharacterDetails from "./useCharacterDetails";
import CharacterStatsPanel from "./CharacterStatsPanel";
import { sanitizeName, sanitizeAndFormatDescription } from "../../utils/textFormat";

function CharacterDetails({ activeCharacter }) {
  const { hasCharacter } = useCharacterDetails(activeCharacter);

  if (!hasCharacter) {
    return (
      <div className="column is-8">
        <div className="notification is-info">Sélectionnez un membre de l'équipage pour l'inspecter.</div>
      </div>
    );
  }

  const lightCone = activeCharacter.lightCone;

  return (
    <div className="column is-8 animate__animated animate__fadeIn">
      <div className="box character-details-box">
        {/* En-tête du personnage */}
        <div className="columns is-vcentered mb-4 has-border-bottom-hsr pb-4">
          <div className="column is-narrow">
            {activeCharacter.iconUrl ? (
              <figure className="image is-64x64">
                <img
                  src={activeCharacter.iconUrl}
                  alt={activeCharacter.name}
                  style={{ borderRadius: "8px", objectFit: "cover", width: "64px", height: "64px" }}
                />
              </figure>
            ) : (
              <div className={`character-avatar-frame rarity-${activeCharacter.rarity || 5}`}>
                <span className="is-size-3">✦</span>
              </div>
            )}
          </div>
          <div className="column">
            <h1 className="title is-3 font-orbitron has-text-gold mb-1">{sanitizeName(activeCharacter.name)}</h1>
            <div className="tags">
              <span className="tag is-dark font-orbitron">Niv. {activeCharacter.level}</span>
              <span className="tag is-warning font-orbitron">Éidolon {activeCharacter.eidolons}</span>
              <span className="tag is-black font-orbitron has-text-gold">{activeCharacter.path}</span>
              <span className="tag is-light font-orbitron">{activeCharacter.combatType}</span>
            </div>
          </div>
        </div>

        {/* Statistiques et équipements */}
        <div className="columns">
          <div className="column is-6">
            <h4 className="title is-5 font-orbitron has-text-gold mb-3">Statistiques</h4>
            <CharacterStatsPanel stats={activeCharacter.stats} />

            {lightCone && (
              <div className="mt-5 p-3 rounded has-border-left-hsr">
                <h4 className="title is-5 font-orbitron has-text-gold mb-3">Passif lightCone</h4>
                <h5 className="title is-6 has-text-gold">{lightCone.passiveName || "—"}</h5>
                <p className="is-size-7 has-text-grey-lighter">
                  {sanitizeAndFormatDescription(lightCone.passiveDescription)}
                </p>
              </div>
            )}
          </div>

          <div className="column is-6">
            <h4 className="title is-5 font-orbitron has-text-gold mb-3">Cône de lumière</h4>
            <div className="box equipment-box">
              <LightConeCard lightCone={lightCone} />
              {lightCone?.storyDescription && (
                <div className="mt-4 is-italic has-text-grey is-size-7">
                  <hr />
                  {lightCone.storyDescription}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CharacterDetails;
