// Coordonnées de l'arbre de la voie du Néant.
const Nihility = {
  name: "Voie du Néant",
  positions: {
    // main skills
    Point03: { x: 320, y: 230 },
    Point01: { x: 210, y: 250 },
    Point02: { x: 430, y: 250 },
    Point04: { x: 320, y: 140 },
    Point05: { x: 320, y: 320 },

    // passive skills
    Point06: { x: 115, y: 150 },
    Point07: { x: 525, y: 150 },
    Point08: { x: 320, y: 55 },

    // small nodes
    Point09: { x: 320, y: 420 },
    Point10: { x: 40, y: 230 },
    Point11: { x: 120, y: 320 },
    Point12: { x: 220, y: 420 },
    Point13: { x: 600, y: 230 },
    Point14: { x: 520, y: 320 },
    Point15: { x: 420, y: 420 },
    Point16: { x: 210, y: 95 },
    Point17: { x: 430, y: 95 },
    Point18: { x: 320, y: 480 },
  },
  rootConnections: [
    ["Point06", "Point01"],
    ["Point01", "Point03"],
    ["Point02", "Point03"],
    ["Point04", "Point03"],
    ["Point05", "Point03"],
    ["Point05", "Point09"],
    ["Point09", "Point18"],
    ["Point04", "Point08"],
    ["Point02", "Point07"],
    ["Point06", "Point10"],
    ["Point10", "Point11"],
    ["Point11", "Point12"],
    ["Point07", "Point13"],
    ["Point13", "Point14"],
    ["Point14", "Point15"],
    ["Point08", "Point16"],
    ["Point08", "Point17"],
  ],
};

export default Nihility;
