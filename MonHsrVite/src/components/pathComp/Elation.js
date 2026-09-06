// Coordonnées de l'arbre de la voie de l'Allégresse.
const Elation = {
  name: "Voie de l'Allégresse",
  positions: {
    // main skills
    Point01: { x: 80, y: 105 },
    Point02: { x: 190, y: 325 },
    Point03: { x: 300, y: 105 },
    Point04: { x: 410, y: 325 },
    Point05: { x: 520, y: 105 },
    // passive skills
    Point06: { x: 135, y: 215 },
    Point07: { x: 245, y: 215 },
    Point08: { x: 355, y: 215 },
    Point09: { x: 465, y: 215 },
    // small nodes
    Point10: { x: 55, y: 215 },
    Point11: { x: 135, y: 95 },
    Point12: { x: 190, y: 155 },
    Point13: { x: 250, y: 345 },
    Point14: { x: 300, y: 268 },
    Point15: { x: 360, y: 70 },
    Point16: { x: 410, y: 145 },
    Point17: { x: 470, y: 352 },
    Point18: { x: 540, y: 215 },
    // special skill
    Point22: { x: 300, y: 390 },
  },
  rootConnections: [
    ["Point01", "Point06"],
    ["Point06", "Point02"],
    ["Point02", "Point07"],
    ["Point07", "Point03"],
    ["Point03", "Point08"],
    ["Point08", "Point04"],
    ["Point04", "Point09"],
    ["Point09", "Point05"],
  ],
};

export default Elation;
