const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        value: Number,
        unit: String
    },
    description: String,
    expiresAt: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > new Date();
            },
            message: "Expiration date must be in future"
        }
    },
    claimed: {
        type: Boolean,
        default: false
    },
    category: {
        type: String
    },
    claimedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    neighborhood: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Neighborhood",
        required: true
    },
    imageUrl: {
        type: String,
        default: null
    }
}, { timestamps: true });

ingredientSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Ingredient", ingredientSchema);