// Démarre le serveur Express et expose les routes de données.
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = 5000;

// Autorise le client Vite à appeler l'API depuis un autre port.
app.use(cors());

// Active la lecture des corps JSON.
app.use(express.json());

// Toutes les routes applicatives utilisent le préfixe /api.
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`\n📚 Available endpoints:\n`);
  console.log(`  GET /api/user/:userId?language=fr`);
  console.log(`    └─ Profil complet (personnages, équipements, stats)\n`);
  console.log(`  GET /api/user/:userId/raw?language=fr`);
  console.log(`    └─ Données brutes Mihomo (debug)\n`);
});
