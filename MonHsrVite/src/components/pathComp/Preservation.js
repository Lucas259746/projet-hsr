// Coordonnées de l'arbre de la voie de la Préservation.
const Preservation = {
  name: "Voie de la Préservation",
  positions: {
    // main skills
    Point01: { x: 300, y: 60 },
    Point02: { x: 140, y: 215 },
    Point03: { x: 300, y: 215 },
    Point04: { x: 460, y: 215 },
    Point05: { x: 300, y: 370 },
    // passive skills
    Point06: { x: 200, y: 120 },
    Point07: { x: 400, y: 120 },
    Point08: { x: 200, y: 310 },
    // small nodes
    Point09: { x: 80, y: 140 },
    Point10: { x: 80, y: 290 },
    Point11: { x: 520, y: 140 },
    Point12: { x: 520, y: 290 },
    Point13: { x: 200, y: 40 },
    Point14: { x: 400, y: 40 },
    Point15: { x: 400, y: 310 },
    Point16: { x: 200, y: 390 },
    Point17: { x: 400, y: 390 },
    Point18: { x: 300, y: 130 },
    Point19: { x: 300, y: 300 },
  },
  rootConnections: [
    ["Point03", "Point01"],
    ["Point03", "Point05"],
    ["Point03", "Point02"],
    ["Point03", "Point04"],
    ["Point01", "Point06"],
    ["Point01", "Point07"],
    ["Point05", "Point08"],
    ["Point05", "Point15"],
  ],
};

export default Preservation;
