// Affiche les statistiques déjà localisées par l'API.

function CharacterStatsPanel({ stats }) {
  if (!stats?.length) {
    return <p className="has-text-grey-light is-size-7">Aucune statistique.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {stats.map((stat) => (
        <div
          key={stat.key}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderLeft: "3px solid #d8b467",
            borderRadius: "7px",
            padding: "7px 10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <span style={{ fontSize: "0.9rem", lineHeight: 1 }}>📊</span>
            <span
              style={{
                flex: 1,
                fontSize: "0.68rem",
                color: "#b3b3b3",
                fontFamily: "Orbitron,sans-serif",
                textTransform: "uppercase",
              }}
            >
              {stat.name}
            </span>
            <span style={{ fontSize: "0.9rem", fontWeight: 700, fontFamily: "Orbitron,sans-serif", color: "#d8b467" }}>
              {stat.total}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CharacterStatsPanel;
