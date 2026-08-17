const cloudinary = require("cloudinary").v2;

const uploadToCloudinary = async (filePath, folder = "ecommerce") => {
    const result = await cloudinary.uploader.upload(filePath, {
        folder
    });

    return {
        public_id: result.public_id,
        secure_url: result.secure_url
    };
};

module.exports = uploadToCloudinary;