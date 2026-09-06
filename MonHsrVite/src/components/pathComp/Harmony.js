// Coordonnées de l'arbre de la voie de l'Harmonie.
const Harmony = {
  name: "Voie de l'Harmonie",
  positions: {
    // main skills
    Point01: { x: 300, y: 215 },
    Point02: { x: 210, y: 145 },
    Point03: { x: 390, y: 145 },
    Point04: { x: 390, y: 285 },
    Point05: { x: 210, y: 285 },
    // passive skills
    Point06: { x: 300, y: 65 },
    Point07: { x: 490, y: 215 },
    Point08: { x: 300, y: 365 },
    Point09: { x: 110, y: 215 },
    // small nodes
    Point10: { x: 208, y: 52 },
    Point11: { x: 392, y: 52 },
    Point12: { x: 530, y: 133 },
    Point13: { x: 530, y: 297 },
    Point14: { x: 392, y: 378 },
    Point15: { x: 208, y: 378 },
    Point16: { x: 70, y: 297 },
    Point17: { x: 70, y: 133 },
    Point18: { x: 300, y: 145 },
    Point19: { x: 300, y: 285 },
  },
  rootConnections: [
    ["Point01", "Point02"],
    ["Point01", "Point03"],
    ["Point01", "Point04"],
    ["Point01", "Point05"],
    ["Point02", "Point06"],
    ["Point03", "Point07"],
    ["Point04", "Point08"],
    ["Point05", "Point09"],
  ],
};

export default Harmony;
