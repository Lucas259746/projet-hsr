// Coordonnées de l'arbre de la voie du Souvenir.
const Remembrance = {
  name: "Voie du Souvenir",
  positions: {
    // main skills
    Point01: { x: 195, y: 315 },
    Point02: { x: 405, y: 315 },
    Point03: { x: 300, y: 340 },
    Point04: { x: 470, y: 225 },
    Point05: { x: 140, y: 225 },
    // passive skills
    Point06: { x: 580, y: 225 },
    Point07: { x: 300, y: 450 },
    Point08: { x: 170, y: 135 },
    // small nodes
    Point09: { x: 50, y: 225 },
    Point10: { x: 70, y: 140 },
    Point11: { x: 70, y: 310 },
    Point12: { x: 560, y: 140 },
    Point13: { x: 560, y: 310 },
    Point14: { x: 210, y: 410 },
    Point15: { x: 390, y: 410 },
    Point16: { x: 160, y: 70 },
    Point17: { x: 250, y: 45},
    Point18: { x: 340, y: 45 },
    // memo skills
    Point19: { x: 300, y: 220 },
    Point20: { x: 300, y: 100 },
  },
  rootConnections: [
    ["Point05", "Point01"],
    ["Point01", "Point03"],
    ["Point03", "Point02"],
    ["Point02", "Point04"],
    ["Point04", "Point06"],
    ["Point03", "Point07"],
    ["Point05", "Point08"],
    ["Point05", "Point09"],
    ["Point09", "Point10"],
    ["Point09", "Point11"],
    ["Point06", "Point12"],
    ["Point06", "Point13"],
    ["Point07", "Point14"],
    ["Point07", "Point15"],
    ["Point08", "Point16"],
    ["Point16", "Point17"],
    ["Point17", "Point18"],
    ["Point19", "Point20"],
  ],
};

export default Remembrance;
