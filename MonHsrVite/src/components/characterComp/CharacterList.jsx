import { sanitizeName } from "../../utils/textFormat";

function CharacterList({ profile, selectedIndex, onSelectCharacter }) {
  return (
    <div className="column is-4">
      <div className="box character-list-box">
        <div className="mb-4 pb-3 has-border-bottom-hsr">
          <h2 className="title is-4 has-text-gold font-orbitron mb-1">{sanitizeName(profile.nickname)}</h2>
          <p className="subtitle is-6 has-text-grey-light mb-0 mt-1">
            Niveau {profile.level} <span className="mx-2">|</span> WorldLevel {profile.worldLevel ?? "—"}
          </p>
        </div>

        <h3 className="title is-6 font-orbitron mb-3 has-text-gold-light">Membres de la vitrine</h3>
        <div className="character-buttons-container">
          {profile.characterList?.map((char, index) => (
            <button
              key={char.id || index}
              className={`button is-fullwidth character-card mb-2 font-orbitron ${selectedIndex === index ? "is-active" : ""}`}
              onClick={() => onSelectCharacter(index)}
            >
              <div className="is-flex is-justify-content-space-between is-align-items-center is-fullwidth">
                <span>{sanitizeName(char.name)}</span>
                <span className="tag is-dark">Lvl {char.level}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CharacterList;
