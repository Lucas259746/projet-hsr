// routes/api.js
const express = require("express");
const router = express.Router();

const { fetchFullAvatarList } = require("../config/hoyolab");
const { getUserData } = require("../utils/serializers");

// ──────────────────────────────────────────────
// GET /api/user/:userId
// Profil sérialisé complet (format attendu par le frontend React)
// ──────────────────────────────────────────────
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { region = "prod_official_eur", language = "fr" } = req.query;
    const user = await getUserData(userId, region, language);
    res.json(user);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ──────────────────────────────────────────────
// GET /api/user/:userId/hoyolab-full
// Alias identique à /user/:userId — conservé pour compat avec App.jsx
// ──────────────────────────────────────────────
router.get("/user/:userId/hoyolab-full", async (req, res) => {
  try {
    const { userId } = req.params;
    const { region = "prod_official_eur", language = "fr" } = req.query;
    const data = await getUserData(userId, region, language);
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ──────────────────────────────────────────────
// GET /api/user/:userId/hoyolab-raw
// Données brutes HoYoLab (debug) — roster complet non sérialisé
// ──────────────────────────────────────────────
router.get("/user/:userId/hoyolab-raw", async (req, res) => {
  try {
    const { userId } = req.params;
    const { region = "prod_official_eur" } = req.query;
    const data = await fetchFullAvatarList(userId, region);
    res.json(data);
  } catch (error) {
    console.error("HoYoLab error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
