const cloudinary = require("cloudinary").v2;
// const CloudinaryStorage = require('multer-storage-cloudinary');
const multer = require("multer");

// cloudinary auto-configures from CLOUDINARY_URL in .env

// Store file in memory as buffer, then upload to cloudinary manually
const upload = multer({ storage: multer.memoryStorage() });

async function uploadToCloudinary(fileBuffer, mimetype) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: "scraps",
                allowed_formats: ["jpg", "jpeg", "png", "webp"],
                transformation: [{ width: 800, crop: "limit", quality: "auto" }]
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(fileBuffer);
    });
}

module.exports = { cloudinary, upload, uploadToCloudinary };