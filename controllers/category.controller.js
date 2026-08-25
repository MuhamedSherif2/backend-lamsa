const asyncHandler = require("../middlewares/asyncHandler");

const Category = require("../models/Category");

const slugify = require("../utils/slugify");


const createCategory = asyncHandler(async (req, res) => {

    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Category name is required"
        });
    }

    const existingCategory = await Category.findOne({
        name: name.trim(),
        isDeleted: false
    });

    if (existingCategory) {
        return res.status(400).json({
            success: false,
            message: "Category already exists"
        });
    }

    const category = await Category.create({
        name: name.trim(),
        slug: slugify(name)
    });

    return res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category
    });
});


const getAllCategories = asyncHandler(async (req, res) => {

    const categories = await Category.find({
        isDeleted: false
    }).sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        count: categories.length,
        data: categories
    });
});


const getCategoryById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const category = await Category.findOne({
        _id: id,
        isDeleted: false
    });

    if (!category) {
        return res.status(404).json({
            success: false,
            message: "Category not found"
        });
    }

    return res.status(200).json({
        success: true,
        data: category
    });
});


const updateCategory = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Category name is required"
        });
    }

    const category = await Category.findOne({
        _id: id,
        isDeleted: false
    });

    if (!category) {
        return res.status(404).json({
            success: false,
            message: "Category not found"
        });
    }

    const existingCategory = await Category.findOne({
        name: name.trim(),
        _id: { $ne: id },
        isDeleted: false
    });

    if (existingCategory) {
        return res.status(400).json({
            success: false,
            message: "Category already exists"
        });
    }

    category.name = name.trim();
    category.slug = slugify(name);

    await category.save();

    return res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: category
    });
});


const deleteCategory = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const category = await Category.findOne({
        _id: id,
        isDeleted: false
    });

    if (!category) {
        return res.status(404).json({
            success: false,
            message: "Category not found"
        });
    }

    category.isDeleted = true;

    await category.save();

    return res.status(200).json({
        success: true,
        message: "Category deleted successfully",
        data: null
    });
});


module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};