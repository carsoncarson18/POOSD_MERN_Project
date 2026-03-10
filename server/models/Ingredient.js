const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    description: String,
    expiresAt: {
        type: Date,
        required: true
    },
    claimed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    claimedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

// automatically delete expired ingredients
ingredientSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Ingredient", ingredientSchema);