const Ingredient = require("../models/Ingredient");
const User = require("../models/User");
const { upload } = require("../config/cloudinary");

const {
  createIngredientClientSchema,
  updateIngredientSchema,
} = require('../validators/ingredient.validator');

const { z } = require('zod');


function validate(data) {
    
    const dataToValidate = { ...data };
    
    // If expiry date exists, convert to date; if conversion failed, throw error
    if (dataToValidate.expiresAt && typeof dataToValidate.expiresAt === 'string') {
        dataToValidate.expiresAt = new Date(dataToValidate.expiresAt);
        
        // Check if date converted successfully
        if(isNaN(dataToValidate.expiresAt.getTime())) {
          throw new Error("Not a valid expiration format");
        }
    }
    
    // Validate with Zod
    return dataToValidate;
}

// Create Ingredient; token session required
const createIngredient = async (req, res, next) => {

  // Directly pass request body and append postedBy field for creation
  try {

    // Validate passed in info
    const validateData = validate(req.body)
    const validateIng = createIngredientClientSchema.safeParse(validateData);
    if (!validateIng.success) {
      const flatError = z.flattenError(validateIng.error);
        return res.status(400).json({
          message: "Validation failed",
          errors: flatError.fieldErrors
        })
    }

    const formData = {
      ...validateIng.data,
      postedBy: req.user._id,
      //imageUrl: req.file ? req.file.path : null
    }

    const newIngredient = await Ingredient.create(formData);
    
    if (!newIngredient) {
      return res.status(401).json("Failed to create ingredient; ensure all fields are filled")
    }
    
    const addIngToUser = await User.findByIdAndUpdate(req.user._id, {$addToSet: { ingredients: newIngredient._id }})
    
    if (!addIngToUser) {
      return res.status(401).json("Failed to add ingredient to user array");
    }
    // success
    return res.json({message: "Successfully created ingredient!", ingredient: newIngredient});


    // fail; display error
  } catch (err) {
    return res.status(500).json({ error: "Failed to create Ingredient", details: err.message })
  }
};

// Pass in ingredient id and whatever ur editing. Will only update
// fields that changed (supposedly)
const editIngredient = async (req, res, next) => {
  try {
    if (!req.body._id) {
      return res.status(400).json("Need an ingredient id to update it!");
    }
    const validateData = validate(req.body)
    // Validate errors
    const validateEditIng = updateIngredientSchema.safeParse(validateData);

    if (!validateEditIng.success) {
      const flatError = z.flattenError(validateEditIng.error);
        return res.status(400).json({
          message: "Validation failed",
          errors: flatError.fieldErrors
        })
    }
    else {
      
      console.log(validateEditIng.data)
    }

    // only allow the following fields to be updated
    const updates = {
      ...validateEditIng.data
    }

    // Ensure ingredient in request was posted by the user
    const getIngredient = await Ingredient.findOne({ _id: req.body._id, postedBy: req.user._id });

    //if not, exit
    if (!getIngredient) {
      return res.status(401).json({ message: "Unauthorized; Only original poster can edit this ingredient" });

    } else {

      // Update ingredient
      const updateStat = await Ingredient.updateOne({ _id: req.body._id }, { $set: updates })

      // success
      return res.json({ message: "Successfully edited ingredient!", ingredientInfo: updateStat })
    }

    // failure
  } catch (err) {
    return res.status(500).json({ error: "Failed to edit ingredient", details: err.message })
  }
};

const getMyIngredients = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    // First, get the user's ingredient IDs
    const user = await User.findById(userId).select('ingredients');
    
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    
    // Second, find all ingredients with those IDs
    const ingredients = await Ingredient.find({
      _id: { $in: user.ingredients }
    });
    
    return res.status(200).json({
      count: ingredients.length,
      data: ingredients
    });
    
  } catch (err) {
    return res.status(500).json({ 
      message: "Failed to retrieve user ingredients",
      details: err.message
    });
  }
};

// Delete by id of ingredient
const deleteIngredient = async (req, res, next) => {
  try {
    const findIngredient = await Ingredient.findOne({ _id: req.body._id, postedBy: req.user._id })
    console.log(findIngredient)


    if (!findIngredient)
      return res.status(401).json({ message: "Ingredient doesn't exist, or you're not authorized to delete it." });

    const deleteIngredient = await Ingredient.deleteOne({ findIngredient })
    return res.json({ message: "Successfully deleted ingredient!", deleteResult: deleteIngredient })

  } catch (err) {
    return res.status(500).json({ error: "Failed to delete ingredient", details: err.message })
  }
};

module.exports = { createIngredient, editIngredient, getMyIngredients, deleteIngredient };