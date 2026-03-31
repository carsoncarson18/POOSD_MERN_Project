const mongoose = require("mongoose");

const neighborhoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"]
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Neighborhood", neighborhoodSchema);