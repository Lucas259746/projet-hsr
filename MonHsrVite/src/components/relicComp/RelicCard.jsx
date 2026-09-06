// Les informations absentes de l'API sont masquées plutôt qu'inventées.

function RelicCard({ relic }) {
  if (!relic) return null;

  return (
    <div className="box relic-box p-3 h-100">
      <div className="is-flex is-justify-content-space-between is-align-items-center mb-1">
        <h5 className="title is-6 mb-0 has-text-gold">{relic.name}</h5>
        <span className="tag is-warning is-small">+{relic.level}</span>
      </div>

      <p className="is-size-7 has-text-grey-light mb-2">{relic.type}</p>

      {relic.mainStat && (
        <div className="relic-mainstat mb-2">
          <span className="has-text-grey-light is-size-7">Stat Principale :</span>
          <p className="is-size-6 has-text-white font-orbitron">
            {relic.mainStat.property}
            {relic.mainStat.value != null && (
              <>
                {" "}
                : <span className="has-text-gold">+{relic.mainStat.value}</span>
              </>
            )}
          </p>
        </div>
      )}

      {relic.subStats?.length > 0 && (
        <div className="relic-substats pl-3 mt-3">
          {relic.subStats.map((sub, idx) => (
            <div key={idx} className="is-flex is-justify-content-space-between is-size-7 mb-1">
              <span className="has-text-grey-light">{sub.property}</span>
              <span className="has-text-white font-orbitron">+{sub.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RelicCard;
