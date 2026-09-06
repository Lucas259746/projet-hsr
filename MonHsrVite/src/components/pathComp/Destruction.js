// Coordonnées de l'arbre de la voie de la Destruction.
const Destruction = {
  name: "Voie de la Destruction",
  positions: {
    // main skills
    Point01: { x: 175, y: 280 },
    Point02: { x: 475, y: 280 },
    Point04: { x: 320, y: 200 },
    Point03: { x: 320, y: 320 },
    Point05: { x: 320, y: 400 },

    // passive skills
    Point06: { x: 220, y: 420 },
    Point07: { x: 420, y: 420 },
    Point11: { x: 65, y: 320 },
    Point10: { x: 130, y: 370 },
    Point09: { x: 320, y: 470 },
    Point16: { x: 320, y: 50 },

    // small nodes
    Point08: { x: 320, y: 125 },
    Point13: { x: 520, y: 370 },
    Point14: { x: 575, y: 320 },
    Point15: { x: 550, y: 180 },
    Point12: { x: 100, y: 180 },
    Point17: { x: 200, y: 70 },

    Point18: { x: 440, y: 70 },
  },
  rootConnections: [
    ["Point01", "Point03"],
    ["Point02", "Point03"],
    ["Point04", "Point03"],
    ["Point05", "Point03"],
    ["Point05", "Point09"],
    ["Point04", "Point08"],
    ["Point05", "Point06"],
    ["Point05", "Point07"],
    ["Point08", "Point16"],
    ["Point06", "Point10"],
    ["Point10", "Point11"],
    ["Point11", "Point12"],
    ["Point07", "Point13"],
    ["Point13", "Point14"],
    ["Point14", "Point15"],
    ["Point16", "Point17"],
    ["Point16", "Point18"],
  ],
};

export default Destruction;
