require("dotenv").config();
const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api"); // Importation du routeur interne contenant la logique métier des requêtes

const app = express();
const PORT = 5000; // Le serveur écoutera sur l'adresse locale http://localhost:5000

// ── CONFIGURATION DES MIDDLEWARES ──

// CORS (Cross-Origin Resource Sharing) : Obligatoire pour autoriser ton application React (généralement sur le port 3000)
app.use(cors());

// Analyseur JSON : Permet au serveur de lire et de décoder automatiquement le contenu des requêtes
// au format JSON reçues dans 'req.body'.
app.use(express.json());

// ── DISPATCHER DE ROUTES ──
// Toutes les requêtes commençant par le préfixe "/api" seront redirigées et gérées par le fichier 'apiRoutes' (ex: /api/user/701536690)
app.use("/api", apiRoutes);

// ── DÉMARRAGE ET INSTRUMENTATION DU SERVEUR ──
app.listen(PORT, () => {
  // Affichage d'informations de diagnostic claires dans le terminal du développeur au lancement du script Node.js
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`\n📚 Available endpoints:\n`);
  console.log(`  GET /api/user/:userId?language=fr`);
  console.log(`    └─ Profil complet (personnages, équipements, stats)\n`);
  console.log(`  GET /api/user/:userId/raw?language=fr`);
  console.log(`    └─ Données brutes Mihomo (debug)\n`);
});
