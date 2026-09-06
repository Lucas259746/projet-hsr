// Coordonnées de l'arbre de la voie de l'Abondance.
const Abundance = {
  name: "Voie de l'Abondance",
  positions: {
    // main skills
    Point01: { x: 300, y: 385 },
    Point02: { x: 195, y: 175 },
    Point03: { x: 405, y: 175 },
    Point04: { x: 300, y: 240 },
    Point05: { x: 300, y: 310 },
    // passive skills
    Point06: { x: 115, y: 105 },
    Point07: { x: 300, y: 80 },
    Point08: { x: 485, y: 105 },
    // small nodes
    Point09: { x: 160, y: 205 },
    Point10: { x: 245, y: 205 },
    Point11: { x: 355, y: 205 },
    Point12: { x: 440, y: 205 },
    Point13: { x: 80, y: 135 },
    Point14: { x: 165, y: 80 },
    Point15: { x: 300, y: 40 },
    Point16: { x: 435, y: 80 },
    Point17: { x: 520, y: 135 },
    Point18: { x: 300, y: 165 },
  },
  rootConnections: [
    ["Point01", "Point05"],
    ["Point05", "Point04"],
    ["Point04", "Point02"],
    ["Point04", "Point03"],
    ["Point04", "Point18"],
    ["Point02", "Point06"],
    ["Point18", "Point07"],
    ["Point03", "Point08"],
  ],
};

export default Abundance;
