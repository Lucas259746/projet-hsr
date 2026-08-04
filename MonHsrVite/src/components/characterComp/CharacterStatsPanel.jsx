// Extrait de CharacterDetails.jsx pour garder ce dernier court.
//
// ⚠️ Simplifié par rapport à l'ancienne version : l'ancien système
// (icône + couleur par stat, décomposition base/bonus) reposait sur des
// clés sémantiques ("crit_rate", "atk"...) que Mihomo fournissait.
// L'API HoYoLab donne désormais des IDs numériques internes (stat.key
// vaut "5", "6", "2"...) sans mapping fiable vers ces clés pour le
// moment — plutôt que d'inventer une correspondance potentiellement
// fausse, on affiche stat.name (déjà localisé par l'API) directement,
// avec un style uniforme.

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
