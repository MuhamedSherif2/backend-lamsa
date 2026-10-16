const asyncHandler = require("../middlewares/asyncHandler");

const Product = require("../models/Product");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");

const slugify = require("../utils/slugify");
const uploadToCloudinary = require("../utils/uploadCloudinary");

// ==================== Helpers ====================

// Supports arrays, JSON strings, or a single string value.
const parseStringArray = (value) => {
    if (value === undefined) return undefined;

    let parsed = value;

    if (typeof parsed === "string") {
        try {
            const json = JSON.parse(parsed);

            if (Array.isArray(json)) {
                parsed = json;
            }
        } catch {
            // Keep the original string.
        }
    }

    if (!Array.isArray(parsed)) {
        parsed = [parsed];
    }

    if (!parsed.every((item) => typeof item === "string")) {
        return null;
    }

    return parsed.map((item) => item.trim());
};

const isValidStringArray = (value) => {
    return (
        Array.isArray(value) &&
        value.length > 0 &&
        value.every((item) => item.length > 0)
    );
};

const parseBoolean = (value) => {
    if (value === true || value === "true") return true;
    if (value === false || value === "false") return false;

    return null;
};

// ==================== Create Product ====================

const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        price,
        discountPrice,
        stock,
        category,
        subCategory,
        isFeatured,
        isActive
    } = req.body;

    const sizes = parseStringArray(req.body.sizes);
    const colors = parseStringArray(req.body.colors);

    // Required fields
    if (
        !name ||
        !description ||
        price === undefined ||
        stock === undefined ||
        !category ||
        !subCategory ||
        !req.files ||
        req.files.length === 0 ||
        sizes === undefined ||
        colors === undefined
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Name, sizes, colors, description, price, stock, images, category and subCategory are required"
        });
    }

    // Validate sizes and colors
    if (!isValidStringArray(sizes) || !isValidStringArray(colors)) {
        return res.status(400).json({
            success: false,
            message:
                "Sizes and colors must be non-empty arrays of valid strings"
        });
    }

    // Validate name and description
    if (
        typeof name !== "string" ||
        name.trim().length < 2 ||
        name.trim().length > 200 ||
        typeof description !== "string" ||
        !description.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: "Name or description is invalid"
        });
    }

    // Validate price
    const priceNumber = Number(price);

    if (!Number.isFinite(priceNumber) || priceNumber < 0) {
        return res.status(400).json({
            success: false,
            message: "Price must be a non-negative number"
        });
    }

    // Validate discount price
    const discountNumber =
        discountPrice === undefined ? 0 : Number(discountPrice);

    if (
        !Number.isFinite(discountNumber) ||
        discountNumber < 0 ||
        discountNumber > priceNumber
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Discount price must be non-negative and cannot exceed price"
        });
    }

    // Validate stock
    const stockNumber = Number(stock);

    if (!Number.isInteger(stockNumber) || stockNumber < 0) {
        return res.status(400).json({
            success: false,
            message: "Stock must be a non-negative integer"
        });
    }

    // Validate boolean fields
    const featuredValue =
        isFeatured === undefined ? false : parseBoolean(isFeatured);

    const activeValue =
        isActive === undefined ? true : parseBoolean(isActive);

    if (featuredValue === null || activeValue === null) {
        return res.status(400).json({
            success: false,
            message: "isFeatured and isActive must be boolean values"
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

    // Check SubCategory belongs to Category
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

    // Check duplicate product name
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
        sizes,
        colors,
        slug: slugify(name),
        description: description.trim(),
        price: priceNumber,
        discountPrice: discountNumber,
        stock: stockNumber,
        images,
        category,
        subCategory,
        isFeatured: featuredValue,
        isActive: activeValue
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
        stock,
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

    // Update Name
    if (name !== undefined) {
        if (
            typeof name !== "string" ||
            name.trim().length < 2 ||
            name.trim().length > 200
        ) {
            return res.status(400).json({
                success: false,
                message: "Name must be between 2 and 200 characters"
            });
        }

        const normalizedName = name.trim();

        const existingProduct = await Product.findOne({
            _id: { $ne: id },
            name: normalizedName,
            isDeleted: false
        });

        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: "Product already exists"
            });
        }

        product.name = normalizedName;
        product.slug = slugify(normalizedName);
    }

    // Update Sizes
    if (req.body.sizes !== undefined) {
        const sizes = parseStringArray(req.body.sizes);

        if (!isValidStringArray(sizes)) {
            return res.status(400).json({
                success: false,
                message: "Sizes must be a non-empty array of valid strings"
            });
        }

        product.sizes = sizes;
    }

    // Update Colors
    if (req.body.colors !== undefined) {
        const colors = parseStringArray(req.body.colors);

        if (!isValidStringArray(colors)) {
            return res.status(400).json({
                success: false,
                message: "Colors must be a non-empty array of valid strings"
            });
        }

        product.colors = colors;
    }

    // Update Description
    if (description !== undefined) {
        if (
            typeof description !== "string" ||
            !description.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Description cannot be empty"
            });
        }

        product.description = description.trim();
    }

    // Update Price
    if (price !== undefined) {
        const priceNumber = Number(price);

        if (!Number.isFinite(priceNumber) || priceNumber < 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be a non-negative number"
            });
        }

        product.price = priceNumber;
    }

    // Update Discount Price
    if (discountPrice !== undefined) {
        const discountNumber = Number(discountPrice);

        if (
            !Number.isFinite(discountNumber) ||
            discountNumber < 0 ||
            discountNumber > product.price
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Discount price must be non-negative and cannot exceed price"
            });
        }

        product.discountPrice = discountNumber;
    }

    // Validate final price and discount together
    if (product.discountPrice > product.price) {
        return res.status(400).json({
            success: false,
            message: "Discount price cannot be greater than price"
        });
    }

    // Update Stock
    if (stock !== undefined) {
        const stockNumber = Number(stock);

        if (!Number.isInteger(stockNumber) || stockNumber < 0) {
            return res.status(400).json({
                success: false,
                message: "Stock must be a non-negative integer"
            });
        }

        product.stock = stockNumber;
    }

    // Update Category
    if (category !== undefined) {
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

        product.category = category;
    }

    // Update SubCategory
    if (subCategory !== undefined) {
        const targetCategory = category || product.category;

        const existingSubCategory = await SubCategory.findOne({
            _id: subCategory,
            category: targetCategory,
            isDeleted: false
        });

        if (!existingSubCategory) {
            return res.status(404).json({
                success: false,
                message:
                    "SubCategory not found or does not belong to this category"
            });
        }

        product.subCategory = subCategory;
    } else if (category !== undefined) {
        // Ensure the current SubCategory belongs to the new Category
        const existingSubCategory = await SubCategory.findOne({
            _id: product.subCategory,
            category,
            isDeleted: false
        });

        if (!existingSubCategory) {
            return res.status(400).json({
                success: false,
                message:
                    "The selected category does not contain the current subCategory. Please provide a valid subCategory."
            });
        }
    }

    // Update Featured Status
    if (isFeatured !== undefined) {
        const featuredValue = parseBoolean(isFeatured);

        if (featuredValue === null) {
            return res.status(400).json({
                success: false,
                message: "isFeatured must be a boolean value"
            });
        }

        product.isFeatured = featuredValue;
    }

    // Update Active Status
    if (isActive !== undefined) {
        const activeValue = parseBoolean(isActive);

        if (activeValue === null) {
            return res.status(400).json({
                success: false,
                message: "isActive must be a boolean value"
            });
        }

        product.isActive = activeValue;
    }

    // Replace Images if new files were uploaded
    if (req.files && req.files.length > 0) {
        const images = [];

        for (const file of req.files) {
            const image = await uploadToCloudinary(
                file.buffer,
                "ecommerce/products"
            );

            images.push(image);
        }

        product.images = images;
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