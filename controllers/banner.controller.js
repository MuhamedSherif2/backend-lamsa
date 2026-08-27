const asyncHandler = require("../middlewares/asyncHandler");

const Banner = require("../models/Banner");

const uploadToCloudinary = require("../utils/uploadCloudinary");


// ==================== Create Banner ====================

const createBanner = asyncHandler(async (req, res) => {

    const { title, link } = req.body;

    if (!title || !link || !req.file) {
        return res.status(400).json({
            success: false,
            message: "Title, link and image are required"
        });
    }

    // Upload image to Cloudinary
    const image = await uploadToCloudinary(
        req.file.buffer,
        "ecommerce/banners"
    );

    // Create Banner
    const banner = await Banner.create({
        title: title.trim(),
        image: image.secure_url,
        link: link.trim()
    });

    return res.status(201).json({
        success: true,
        message: "Banner created successfully",
        data: banner
    });
});


// ==================== Get All Banners ====================

const getAllBanners = asyncHandler(async (req, res) => {

    const banners = await Banner.find({
        isDeleted: false
    }).sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        count: banners.length,
        data: banners
    });
});


// ==================== Update Banner ====================

const updateBanner = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const { title, link } = req.body;

    const banner = await Banner.findOne({
        _id: id,
        isDeleted: false
    });

    if (!banner) {
        return res.status(404).json({
            success: false,
            message: "Banner not found"
        });
    }

    // Update title
    if (title !== undefined) {
        banner.title = title.trim();
    }

    // Update link
    if (link !== undefined) {
        banner.link = link.trim();
    }

    // Upload new image if provided
    if (req.file) {

        const image = await uploadToCloudinary(
            req.file.buffer,
            "ecommerce/banners"
        );

        banner.image = image.secure_url;
    }

    await banner.save();

    return res.status(200).json({
        success: true,
        message: "Banner updated successfully",
        data: banner
    });
});


// ==================== Delete Banner ====================

const deleteBanner = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const banner = await Banner.findOne({
        _id: id,
        isDeleted: false
    });

    if (!banner) {
        return res.status(404).json({
            success: false,
            message: "Banner not found"
        });
    }

    // Soft Delete
    banner.isDeleted = true;

    await banner.save();

    return res.status(200).json({
        success: true,
        message: "Banner deleted successfully",
        data: null
    });
});


module.exports = {
    createBanner,
    getAllBanners,
    updateBanner,
    deleteBanner
};