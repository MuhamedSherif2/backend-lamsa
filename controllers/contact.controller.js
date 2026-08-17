const asyncHandler = require("../middlewares/asyncHandler");

const createContactMessage = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const getAllContactMessages = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const getContactMessageById = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const markAsRead = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

const deleteContactMessage = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        // count: categories.length,
        // data: categories
    });
});

module.exports = {
    createContactMessage,
    getAllContactMessages,
    getContactMessageById,
    markAsRead,
    deleteContactMessage,
}