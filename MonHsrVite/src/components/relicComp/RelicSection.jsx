import RelicCard from "./RelicCard";
import CharacterStats from "../characterComp/CharacterStats";

function RelicSection({ activeCharacter }) {
  if (!activeCharacter) return null;

  const relicSets = activeCharacter.relicSets || [];

  return (
    <div className="relic-section box mt-5">
      <div className="columns is-desktop">
        <div className="column is-4-desktop">
          <CharacterStats stats={activeCharacter.stats} />

          {relicSets.length > 0 && (
            <div className="mt-4">
              <h4 className="title is-6 font-orbitron has-text-gold mb-3">Bonus de Sets</h4>
              {relicSets.map((set) => (
                <div
                  key={`${set.id}-${set.num}`}
                  className="box has-background-black-bis p-3 mb-2"
                  style={{ borderLeft: "3px solid #f29e38" }}
                >
                  <div className="is-flex is-justify-content-space-between is-align-items-center mb-1">
                    <span className="has-text-white is-size-7 has-text-weight-bold">{set.name}</span>
                    <span className="tag is-warning is-small">{set.num} pcs</span>
                  </div>
                  <p className="is-size-7 has-text-grey-lighter" style={{ lineHeight: "1.3" }}>
                    {set.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="column is-8-desktop">
          <h3 className="title is-5 font-orbitron has-text-gold mb-4">Reliques d'équipement</h3>
          <div className="columns is-multiline">
            {activeCharacter.relics?.map((relic) => (
              <div key={relic.id || relic.name} className="column is-half-tablet is-one-third-widescreen">
                <RelicCard relic={relic} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RelicSection;
