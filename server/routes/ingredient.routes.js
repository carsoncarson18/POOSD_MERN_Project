const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth.middleware");
const { upload } = require("../config/cloudinary");
const {
  createIngredient,
  editIngredient,
  getMyIngredients,
  claimIngredient,
  deleteIngredient,
} = require("../controllers/ingredient.controller");

// Create Ingredient; token session required
router.post(
  "/createIngredient",
  auth,
  upload.single("image"),
  createIngredient,
);

// Pass in ingredient id and whatever ur editing. Will only update
// fields that changed (supposedly)
router.post("/editIngredient", auth, editIngredient);

// Get ingredients matching the user's id
router.get("/getMyIngredients", auth, getMyIngredients);

// Claim ingredient (requires ingredient id); also emails original poster
router.post("/claimIngredient", auth, claimIngredient);

// Delete by id of ingredient
router.delete("/deleteIngredient", auth, deleteIngredient);

module.exports = router;
