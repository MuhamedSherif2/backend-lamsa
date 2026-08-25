const asyncHandler = require("../middlewares/asyncHandler");

const Product = require("../models/Product");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");

const slugify = require("../utils/slugify");
const uploadToCloudinary = require("../utils/uploadCloudinary");


// ==================== Create Product ====================

const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        price,
        discountPrice,
        category,
        subCategory,
        isFeatured
    } = req.body;

    if (
        !name ||
        !description ||
        price === undefined ||
        !category ||
        !subCategory ||
        !req.files ||
        req.files.length === 0
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Name, description, price, images, category and subCategory are required"
        });
    }

    // Check Category
    const existingCategory = await Category.findOne({
        _id: category,
        isDeleted: false
    });

    if (!existingCategory) {
        return res.status(404).json({
            success: false,
            message: "Category not found"
        });
    }

    // Check SubCategory
    const existingSubCategory = await SubCategory.findOne({
        _id: subCategory,
        category,
        isDeleted: false
    });

    if (!existingSubCategory) {
        return res.status(404).json({
            success: false,
            message:
                "SubCategory not found or does not belong to this category"
        });
    }

    // Check Product
    const existingProduct = await Product.findOne({
        name: name.trim(),
        isDeleted: false
    });

    if (existingProduct) {
        return res.status(400).json({
            success: false,
            message: "Product already exists"
        });
    }

    // Check Discount Price
    if (
        discountPrice !== undefined &&
        Number(discountPrice) > Number(price)
    ) {
        return res.status(400).json({
            success: false,
            message: "Discount price cannot be greater than price"
        });
    }

    // Upload Images
    const images = [];

    for (const file of req.files) {
        const image = await uploadToCloudinary(
            file.buffer,
            "ecommerce/products"
        );

        images.push(image);
    }

    // Create Product
    const product = await Product.create({
        name: name.trim(),
        slug: slugify(name),
        description: description.trim(),
        price: Number(price),
        discountPrice:
            discountPrice !== undefined
                ? Number(discountPrice)
                : 0,
        images,
        category,
        subCategory,
        isFeatured: isFeatured === "true" || isFeatured === true
    });

    return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product
    });
});


// ==================== Get All Products ====================

const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({
        isDeleted: false,
        isActive: true
    })
        .populate("category", "name slug")
        .populate("subCategory", "name slug")
        .sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});


// ==================== Get Product By Slug ====================

const getProductBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const product = await Product.findOne({
        slug,
        isDeleted: false,
        isActive: true
    })
        .populate("category", "name slug")
        .populate("subCategory", "name slug");

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    return res.status(200).json({
        success: true,
        data: product
    });
});


// ==================== Get Product By ID ====================

const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findOne({
        _id: id,
        isDeleted: false,
        isActive: true
    })
        .populate("category", "name slug")
        .populate("subCategory", "name slug");

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    return res.status(200).json({
        success: true,
        data: product
    });
});


// ==================== Update Product ====================

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const {
        name,
        description,
        price,
        discountPrice,
        category,
        subCategory,
        isFeatured,
        isActive
    } = req.body;

    const product = await Product.findOne({
        _id: id,
        isDeleted: false
    });

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    // Check Category
    if (category) {
        const existingCategory = await Category.findOne({
            _id: category,
            isDeleted: false
        });

        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
    }

    // Check SubCategory
    if (subCategory) {
        const categoryId = category || product.category;

        const existingSubCategory = await SubCategory.findOne({
            _id: subCategory,
            category: categoryId,
            isDeleted: false
        });

        if (!existingSubCategory) {
            return res.status(404).json({
                success: false,
                message:
                    "SubCategory not found or does not belong to this category"
            });
        }
    }

    // Check Price
    const newPrice =
        price !== undefined
            ? Number(price)
            : product.price;

    const newDiscountPrice =
        discountPrice !== undefined
            ? Number(discountPrice)
            : product.discountPrice;

    if (newDiscountPrice > newPrice) {
        return res.status(400).json({
            success: false,
            message: "Discount price cannot be greater than price"
        });
    }

    // Update Name
    if (name) {
        const existingProduct = await Product.findOne({
            name: name.trim(),
            _id: { $ne: id },
            isDeleted: false
        });

        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: "Product name already exists"
            });
        }

        product.name = name.trim();
        product.slug = slugify(name);
    }

    // Update Fields
    if (description !== undefined) {
        product.description = description.trim();
    }

    if (price !== undefined) {
        product.price = Number(price);
    }

    if (discountPrice !== undefined) {
        product.discountPrice = Number(discountPrice);
    }

    if (category !== undefined) {
        product.category = category;
    }

    if (subCategory !== undefined) {
        product.subCategory = subCategory;
    }

    if (isFeatured !== undefined) {
        product.isFeatured =
            isFeatured === "true" || isFeatured === true;
    }

    if (isActive !== undefined) {
        product.isActive =
            isActive === "true" || isActive === true;
    }


    // Upload New Images
    if (req.files && req.files.length > 0) {
        const newImages = [];

        for (const file of req.files) {
            const image = await uploadToCloudinary(
                file.buffer,
                "ecommerce/products"
            );

            newImages.push(image);
        }

        product.images = newImages;
    }


    await product.save();

    return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product
    });
});


// ==================== Delete Product ====================

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findOne({
        _id: id,
        isDeleted: false
    });

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    product.isDeleted = true;

    await product.save();

    return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        data: null
    });
});


module.exports = {
    createProduct,
    getAllProducts,
    getProductBySlug,
    getProductById,
    updateProduct,
    deleteProduct
};