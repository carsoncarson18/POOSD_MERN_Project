const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth.middleware");
const { joinHood, createHood, getAllHoodIngredients, getAllUserHoods, deleteUserHood } = require("../controllers/neighborhood.controller");

// Join neighborhood that already exists
router.post("/joinHood", auth, joinHood);

// Create neighborhood and name it if you're the first to join
router.post("/createHood", auth, createHood);

// Returns all ingredients posted within a neighborhood
// Pass in the ID of the neighborhood to get them
router.get("/getAllHoodIngredients", auth, getAllHoodIngredients);

router.get("/getAllUserHoods", auth, getAllUserHoods);

router.delete("/deleteUserHood", auth, deleteUserHood);

module.exports = router;