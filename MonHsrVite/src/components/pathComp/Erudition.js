// Coordonnées de l'arbre de la voie de l'Érudition.
const Erudition = {
  name: "Voie de l'Érudition",
  positions: {
    // main skills
    Point01: { x: 300, y: 215 },
    Point02: { x: 300, y: 115 },
    Point03: { x: 390, y: 163 },
    Point04: { x: 390, y: 267 },
    Point05: { x: 300, y: 315 },
    // passive skills
    Point06: { x: 210, y: 267 },
    Point07: { x: 210, y: 163 },
    Point08: { x: 300, y: 40 },
    // small nodes
    Point09: { x: 120, y: 115 },
    Point10: { x: 480, y: 115 },
    Point11: { x: 480, y: 315 },
    Point12: { x: 120, y: 315 },
    Point13: { x: 300, y: 390 },
    Point14: { x: 110, y: 215 },
    Point15: { x: 210, y: 72 },
    Point16: { x: 390, y: 72 },
    Point17: { x: 390, y: 358 },
    Point18: { x: 210, y: 358 },
    Point19: { x: 490, y: 215 },
  },
  rootConnections: [
    ["Point01", "Point02"],
    ["Point01", "Point03"],
    ["Point01", "Point04"],
    ["Point01", "Point05"],
    ["Point01", "Point06"],
    ["Point01", "Point07"],
    ["Point02", "Point08"],
    ["Point04", "Point19"],
  ],
};

export default Erudition;
