// ⚠️ Le rang de superposition (1-5) n'est jamais fourni par l'API
// HoYoLab actuelle — affiché en "?" plutôt qu'une valeur inventée.
// Le splash art (portrait) n'est pas fourni non plus, contrairement à
// l'ancien système imageMap — cette section a été retirée.

function LightConeCard({ lightCone }) {
  if (!lightCone) {
    return <p className="has-text-grey-light">Aucun cône de lumière équipé.</p>;
  }

  return (
    <div className="lightcone-container">
      <div className="is-flex is-align-items-center mb-3">
        <div className={`equipment-icon-frame rarity-${lightCone.rarity || 3}`}>
          {lightCone.iconUrl ? (
            <img
              src={lightCone.iconUrl}
              alt={lightCone.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span>✦</span>
          )}
        </div>
        <div className="ml-3">
          <h5 className="title is-5 mb-1 has-text-gold">{lightCone.name}</h5>
        </div>
      </div>

      <div className="columns is-mobile is-multiline is-gapless mt-3 lightcone-meta-box">
        <div className="column is-6">
          <span className="has-text-grey-light is-size-7">NIVEAU</span>
          <p className="is-size-6 has-text-white font-orbitron">
            Lv. <span className="has-text-gold">{lightCone.level || 1}</span>
          </p>
        </div>

        <div className="column is-6 has-text-right">
          <span className="has-text-grey-light is-size-7">SUPERPOSITION</span>
          <p className="is-size-6 has-text-white font-orbitron">
            Rang <span className="has-text-warning">{lightCone.superimposition ?? "?"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LightConeCard;
