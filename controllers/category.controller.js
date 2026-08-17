const asyncHandler = require("../middlewares/asyncHandler");

const createCategory = asyncHandler(async (req, res, next) => {
    
    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const getAllCategories = asyncHandler(async (req, res, next) => {
    
    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const getCategoryById = asyncHandler(async (req, res, next) => {
    
    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const updateCategory = asyncHandler(async (req, res, next) => {
    
    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const deleteCategory = asyncHandler(async (req, res, next) => {
    
    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
}