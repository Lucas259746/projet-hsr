// Coordonnées de l'arbre de la voie de la Chasse.
const Hunt = {
  name: "Voie de la Chasse",
  positions: {
    // main skills
    Point01: { x: 55, y: 215 },
    Point02: { x: 165, y: 215 },
    Point03: { x: 275, y: 215 },
    Point04: { x: 385, y: 215 },
    Point05: { x: 495, y: 215 },
    // passive skills
    Point06: { x: 220, y: 115 },
    Point07: { x: 330, y: 115 },
    Point08: { x: 220, y: 315 },
    // small nodes
    Point09: { x: 110, y: 115 },
    Point10: { x: 440, y: 115 },
    Point11: { x: 110, y: 315 },
    Point12: { x: 440, y: 315 },
    Point13: { x: 570, y: 155 },
    Point14: { x: 570, y: 275 },
    Point15: { x: 275, y: 45 },
    Point16: { x: 275, y: 385 },
    Point17: { x: 18, y: 155 },
    Point18: { x: 18, y: 275 },
  },
  rootConnections: [
    ["Point01", "Point02"],
    ["Point02", "Point03"],
    ["Point03", "Point04"],
    ["Point04", "Point05"],
    ["Point02", "Point06"],
    ["Point03", "Point07"],
    ["Point02", "Point08"],
    ["Point03", "Point09"],
  ],
};

export default Hunt;
