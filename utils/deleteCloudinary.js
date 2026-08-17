const cloudinary = require("cloudinary").v2;

const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return;

    return await cloudinary.uploader.destroy(publicId);
};

module.exports = deleteFromCloudinary;