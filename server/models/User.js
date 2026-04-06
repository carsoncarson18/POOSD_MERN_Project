const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    neighborhoods: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Neighborhood"
    }],
    ingredients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", userSchema);