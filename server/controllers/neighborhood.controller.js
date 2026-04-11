const Neighborhood = require("../models/Neighborhood");
const User = require("../models/User");
const Ingredient = require("../models/Ingredient");
const { hoodNameSchema } = require('../validators/neighborhood.validator');
const { z } = require('zod');

// Join neighborhood that already exist
const joinHood = async (req, res) => {
  try {
    const { zipCode } = req.body;

    if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
      return res.status(400).json({
        error: "Invalid ZIP code format",
      });
    }

    const exists = await Neighborhood.exists({ zipCode });

    if (!exists) {
      return res.json({ status: 'new', message: 'new ZIP code' });
    }

    await Neighborhood.findByIdAndUpdate(
      exists,
      { $addToSet: { members: req.user._id } }
    );

    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { neighborhoods: exists } }
    )

    res.json({ status: 'joined', message: 'joined ZIP code' });

  } catch (err) {
    res.status(500).json({ error: "Failed to join Neighborhood", details: err.message });
  }
};

// Create neighborhood and name it if your the first to join
const createHood = async (req, res) => {
  try {
    const { name, zipCode } = req.body;

    const validateHoodName = hoodNameSchema.safeParse(name);
    if (!validateHoodName.success) {
      const prettyError = z.flattenError(validateHoodName.error)
        return res.status(400).json({
          message: "Validation failed",
          errors: prettyError
        })
    }

    const neighborhood = await Neighborhood.create({
      name: name,
      zipCode: zipCode,
      members: [req.user._id],
      createdBy: req.user._id
    });

    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { neighborhoods: neighborhood._id } }
    )

    res.json(neighborhood);

  } catch (err) {
    res.status(500).json({ error: "Failed to make Neighborhood", details: err.message });
  }
};

// Returns all ingredients posted within a neighborhood
// Pass in the ID of the neighborhood to get them
const getAllHoodIngredients = async (req, res, next) => {
  try {

    if (!req.body._id) {
        return res.status(400).json({success: false, message: "Need a neighborhood id for this!!"})
    }
    const allIngredients = await Ingredient.find({ neighborhood: req.body._id });
    return res.json({ ingredients: allIngredients });

  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch ingredients", details: err.message })
  }
};

const getAllUserHoods = async (req, res) => {
  try {
    const hoods = await Neighborhood.find({ members: req.user._id })
  
    return res.json({ neighborhoods: hoods });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch Users Neighborhoods", details: err.message })
  }

}

const deleteUserHood = async (req, res) => {
  try {
    await Neighborhood.updateOne({ _id: req.body._id }, { $pull: { members: req.user._id } })
    await User.updateOne({ _id: req.user._id }, { $pull: { neighborhoods: req.body._id } })
  
    return res.json({ message: "Successfully deleted Neighborhood" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete Users Neighborhood", details: err.message })
  }
}


module.exports = { joinHood, createHood, getAllHoodIngredients, getAllUserHoods, deleteUserHood };