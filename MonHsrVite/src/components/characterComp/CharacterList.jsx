import { sanitizeName } from "../../utils/textFormat";

function CharacterList({ profile, selectedIndex, onSelectCharacter }) {
  const characters = profile.characterList || [];
  const renderCharacter = (character, index) => (
    <button
      key={character.id || index}
      className={`button is-fullwidth character-card mb-2 font-orbitron ${selectedIndex === index ? "is-active" : ""}`}
      onClick={() => onSelectCharacter(index)}
    >
      <div className="is-flex is-justify-content-space-between is-align-items-center is-fullwidth">
        <span>{sanitizeName(character.name)}</span>
        <span className="tag is-dark">Lvl {character.level}</span>
      </div>
    </button>
  );

  return (
    <div className="column is-4">
      <div className="box character-list-box">
        <div className="mb-4 pb-3 has-border-bottom-hsr">
          <h2 className="title is-4 has-text-gold font-orbitron mb-1">{sanitizeName(profile.nickname)}</h2>
          <p className="subtitle is-6 has-text-grey-light mb-0 mt-1">
            Niveau {profile.level} <span className="mx-2">|</span> WorldLevel {profile.worldLevel ?? "—"}
          </p>
        </div>

        <h3 className="title is-6 font-orbitron mb-3 has-text-gold-light">
          Personnages
        </h3>
        <div className="character-buttons-container">
          {characters.length > 0
            ? characters.map((character, index) => renderCharacter(character, index))
            : <p className="has-text-grey-light is-size-7">Aucun personnage en vitrine.</p>}
        </div>
      </div>
    </div>
  );
}

export default CharacterList;
