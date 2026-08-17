const asyncHandler = require("../middlewares/asyncHandler");

const createFAQ = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const getAllFAQs = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const updateFAQ = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const deleteFAQ = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

module.exports = {
    createFAQ,
    getAllFAQs,
    updateFAQ,
    deleteFAQ,
}