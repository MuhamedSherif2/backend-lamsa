const asyncHandler = require("../middlewares/asyncHandler");

const getCart = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const addToCart = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const updateCartItemQuantity = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const removeFromCart = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const clearCart = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

module.exports = {
    getCart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
}