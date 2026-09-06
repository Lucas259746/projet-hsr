// Coordonnées SVG de chaque voie, regroupées derrière une API unique.
import Destruction from "./Destruction";
import Nihility from "./Nihility";
import Abundance from "./Abundance";
import Preservation from "./Preservation";
import Harmony from "./Harmony";
import Hunt from "./Hunt";
import Erudition from "./Erudition";
import Elation from "./Elation";
import Remembrance from "./Remembrance";

export const PATH_LAYOUTS = {
  // Noms natifs utilisés par l'application.
  Destruction: Destruction,
  Nihility: Nihility,
  Abundance: Abundance,
  Preservation: Preservation,
  Harmony: Harmony,
  Hunt: Hunt,
  Erudition: Erudition,
  Elation: Elation,
  Remembrance: Remembrance,

  // Variantes normalisées provenant des API externes.
  destruction: Destruction,
  nihility: Nihility,
  abundance: Abundance,
  preservation: Preservation,
  harmony: Harmony,
  hunt: Hunt,
  the_hunt: Hunt,
  erudition: Erudition,
  elation: Elation,
  remembrance: Remembrance,

  // Libellés français affichés dans l'application.
  "La Destruction": Destruction,
  "La Nihilité": Nihility,
  "L'Abondance": Abundance,
  "La Préservation": Preservation,
  "L'Harmonie": Harmony,
  "La Chasse": Hunt,
  "L'Érudition": Erudition,
  "L'Allégresse": Elation,
  "Le Souvenir": Remembrance,

  // Rôles techniques utilisés par certaines sources de données.
  Warrior: Destruction,
  Warlock: Nihility,
  Priest: Abundance,
  Knight: Preservation,
  Shaman: Harmony,
  Rogue: Hunt,
  Mage: Erudition,
  Unknown: Remembrance,
};
