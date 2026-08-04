// ⚠️ Même simplification que CharacterStatsPanel.jsx : plus de mapping
// icône/couleur par clé sémantique (l'API HoYoLab donne des IDs
// numériques non-mappés pour le moment), affichage uniforme avec
// stat.name déjà localisé par l'API.

function StatCard({ stat }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderLeft: "3px solid #d8b467",
        borderRadius: "8px",
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "1rem", lineHeight: 1 }}>📊</span>
        <span
          style={{
            flex: 1,
            fontSize: "0.72rem",
            color: "#b3b3b3",
            fontFamily: "Orbitron, sans-serif",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {stat.name}
        </span>
        <span style={{ fontSize: "1rem", fontWeight: 700, fontFamily: "Orbitron, sans-serif", color: "#d8b467" }}>
          {stat.total}
        </span>
      </div>
    </div>
  );
}

function CharacterStats({ stats }) {
  if (!stats || stats.length === 0) {
    return <p className="has-text-grey-light is-size-7">Aucune statistique disponible.</p>;
  }

  return (
    <div className="box has-background-black-bis p-4" style={{ borderLeft: "3px solid #d8b467" }}>
      <h3 className="title is-5 font-orbitron has-text-gold mb-4">Statistiques</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {stats.map((stat) => (
          <StatCard key={stat.key} stat={stat} />
        ))}
      </div>
    </div>
  );
}

export default CharacterStats;
