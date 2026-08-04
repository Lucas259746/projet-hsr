// utils/serializers/skillOverrides/1509-gilgamesh.js
//
// Overrides manuels des descriptions de compétences/traces pour un
// personnage donné. PRIORITÉ MAXIMALE : si une entrée existe ici, elle
// écrase systématiquement le cache Mar-7th, même si celui-ci est à jour.
//
// Utilité :
// 1. Combler un trou si Mar-7th n'a pas encore ce personnage (nouveaux
//    persos ajoutés au jeu avant que le dépôt soit mis à jour)
// 2. Corriger une description erronée/obsolète dans le cache externe
// 3. Continuer à fonctionner même si Mar-7th arrête complètement d'être
//    maintenu un jour
//
// Clé = le point_id EXACT tel que renvoyé par l'API HoYoLab (visible
// dans detail.summary.skills[].point_id et skills_other[].point_id).
//
// ── Comment remplir ──
// 1. Prends le point_id depuis la réponse JSON de l'API (ex: "1509003")
// 2. Va sur le wiki HSR ou en jeu pour copier le texte exact de la
//    compétence à ce niveau
// 3. Ajoute une entrée ici

module.exports = {
  // Exemple — à remplacer par les vraies valeurs si Mar-7th ne couvre
  // pas ce personnage ou ce point précis :
  //
  // "1509003": {
  //   name: "Roi des Héros",
  //   description:
  //     "Inflige des DGT Vent à tous les ennemis, équivalents à 200% de l'ATQ de Gilgamesh...",
  // },
};
