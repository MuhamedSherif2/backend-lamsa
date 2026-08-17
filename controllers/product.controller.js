const asyncHandler = require("../middlewares/asyncHandler");

const createProduct = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const getAllProducts = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const getProductBySlug = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const getProductById = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});
const updateProduct = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});
const getProductById = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const deleteProduct = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

module.exports = {
    createProduct,
    getAllProducts,
    getProductBySlug,
    getProductById,
    deleteProduct,
    updateProduct
}