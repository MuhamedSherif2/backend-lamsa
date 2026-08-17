const asyncHandler = require("../middlewares/asyncHandler");

const createSubCategory = asyncHandler(async (req, res, next) => {
    
    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const getAllSubCategories = asyncHandler(async (req, res, next) => {
    
    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const getSubCategoryById = asyncHandler(async (req, res, next) => {
    
    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const getSubCategoriesByCategory = asyncHandler(async (req, res, next) => {
    
    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const updateSubCategory = asyncHandler(async (req, res, next) => {
    
    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const deleteSubCategory = asyncHandler(async (req, res, next) => {
    
    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

module.exports = {
    createSubCategory,
    getAllSubCategories,
    getSubCategoryById,
    getSubCategoriesByCategory,
    updateSubCategory,
    deleteSubCategory,
}