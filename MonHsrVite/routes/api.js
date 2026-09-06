const express = require("express");
const router = express.Router();

const { fetchFullAvatarList } = require("../config/hoyolab");
const { getUserData, getUserRoster, getCharacterData } = require("../utils/serializers");

async function sendUserProfile(req, res) {
  try {
    const { userId } = req.params;
    const { region = "prod_official_eur", language = "fr" } = req.query;
    const user = await getUserData(userId, region, language);
    res.json(user);
  } catch (error) {
    console.error("Profile request failed:", error);
    res.status(500).json({ error: error.message });
  }
}

router.get("/user/:userId", sendUserProfile);
router.get("/user/:userId/hoyolab-full", sendUserProfile);

router.get("/user/:userId/hoyolab-roster", async (req, res) => {
  try {
    const { userId } = req.params;
    const { region = "prod_official_eur" } = req.query;
    res.json(await getUserRoster(userId, region));
  } catch (error) {
    console.error("Roster request failed:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/user/:userId/character/:itemId", async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { region = "prod_official_eur", language = "fr" } = req.query;
    res.json(await getCharacterData(userId, region, itemId, language));
  } catch (error) {
    console.error("Character detail request failed:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/user/:userId/hoyolab-raw", async (req, res) => {
  try {
    const { userId } = req.params;
    const { region = "prod_official_eur" } = req.query;
    const data = await fetchFullAvatarList(userId, region);
    res.json(data);
  } catch (error) {
    console.error("Raw HoYoLab request failed:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
