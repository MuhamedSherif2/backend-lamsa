const asyncHandler = require("../middlewares/asyncHandler");

const createCoupon = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const getAllCoupons = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const getCouponById = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const applyCoupon = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const updateCoupon = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const deleteCoupon = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

module.exports = {
    createCoupon,
    getAllCoupons,
    getCouponById,
    applyCoupon,
    updateCoupon,
    deleteCoupon,
}