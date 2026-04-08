const cloudinary = require("cloudinary").v2;
const CloudinaryStorage = require('multer-storage-cloudinary');
const multer = require("multer");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "scraps",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 800, crop: "limit", quality: "auto" }]
    }
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };