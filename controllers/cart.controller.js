const asyncHandler = require("../middlewares/asyncHandler");

const Cart = require("../models/Cart");

const Product = require("../models/Product");


// ==================== Get Cart ====================

const getCart = asyncHandler(async (req, res) => {

    const cart = await Cart.findOne({
        user: req.user._id
    }).populate({
        path: "items.product",
        select: "name slug price discountPrice images category subCategory isActive isDeleted"
    });

    if (!cart) {
        return res.status(200).json({
            success: true,
            count: 0,
            data: {
                items: [],
                totalPrice: 0
            }
        });
    }

    return res.status(200).json({
        success: true,
        count: cart.items.length,
        data: cart
    });
});


// ==================== Add To Cart ====================

const addToCart = asyncHandler(async (req, res) => {

    const { productId, quantity, size, color } = req.body;

    if (!productId) {
        return res.status(400).json({
            success: false,
            message: "Product ID is required"
        });
    }

    const itemQuantity = quantity !== undefined
        ? Number(quantity)
        : 1;

    if (!Number.isInteger(itemQuantity) || itemQuantity < 1) {
        return res.status(400).json({
            success: false,
            message: "Quantity must be a positive integer"
        });
    }

    const product = await Product.findOne({
        _id: productId,
        isDeleted: false,
        isActive: true
    });

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    const productPrice =
        product.discountPrice > 0
            ? product.discountPrice
            : product.price;

    let cart = await Cart.findOne({
        user: req.user._id
    });

    // Create cart if not exists
    if (!cart) {

        const subTotal = productPrice * itemQuantity;

        cart = await Cart.create({
            user: req.user._id,

            items: [
                {
                    product: productId,
                    quantity: itemQuantity,
                    price: productPrice,
                    subTotal,
                    size,
                    color
                }
            ],

            totalPrice: subTotal
        });

        await cart.populate({
            path: "items.product",
            select: "name slug price discountPrice images category subCategory"
        });

        return res.status(201).json({
            success: true,
            message: "Product added to cart",
            data: cart
        });
    }

    // Check same product + same size + same color
    const existingItem = cart.items.find(
        item =>
            item.product.toString() === productId.toString() &&
            item.size === size &&
            item.color === color
    );

    if (existingItem) {

        existingItem.quantity += itemQuantity;

        existingItem.price = productPrice;

        existingItem.subTotal =
            existingItem.quantity * productPrice;

    } else {

        cart.items.push({
            product: productId,
            quantity: itemQuantity,
            price: productPrice,
            subTotal: productPrice * itemQuantity,
            size,
            color
        });
    }

    cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.subTotal,
        0
    );

    await cart.save();

    await cart.populate({
        path: "items.product",
        select: "name slug price discountPrice images category subCategory"
    });

    return res.status(200).json({
        success: true,
        message: "Product added to cart",
        data: cart
    });
});


// ==================== Update Cart Item Quantity ====================

const updateCartItemQuantity = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const { productId, quantity, size, color } = req.body;

    if (!id || !productId || quantity === undefined) {
        return res.status(400).json({
            success: false,
            message: "Cart ID, Product ID and quantity are required"
        });
    }

    const newQuantity = Number(quantity);

    if (!Number.isInteger(newQuantity) || newQuantity < 1) {
        return res.status(400).json({
            success: false,
            message: "Quantity must be a positive integer"
        });
    }

    const cart = await Cart.findOne({
        _id: id,
        user: req.user._id
    });

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: "Cart not found"
        });
    }

    const item = cart.items.find(
        item =>
            item.product.toString() === productId.toString() &&
            item.size === size &&
            item.color === color
    );

    if (!item) {
        return res.status(404).json({
            success: false,
            message: "Product not found in cart"
        });
    }

    const product = await Product.findOne({
        _id: productId,
        isDeleted: false,
        isActive: true
    });

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found or inactive"
        });
    }

    const productPrice =
        product.discountPrice > 0
            ? product.discountPrice
            : product.price;

    item.quantity = newQuantity;

    item.price = productPrice;

    item.subTotal = newQuantity * productPrice;

    cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.subTotal,
        0
    );

    await cart.save();

    await cart.populate({
        path: "items.product",
        select: "name slug price discountPrice images category subCategory"
    });

    return res.status(200).json({
        success: true,
        message: "Cart quantity updated successfully",
        data: cart
    });
});

// ==================== Remove From Cart ====================

const removeFromCart = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    const { size, color } = req.query;

    if (!productId) {
        return res.status(400).json({
            success: false,
            message: "Product ID is required"
        });
    }

    const cart = await Cart.findOne({
        user: req.user._id
    });

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: "Cart not found"
        });
    }

    const itemExists = cart.items.some(
        item =>
            item.product.toString() === productId.toString() &&
            item.size === size &&
            item.color === color
    );

    if (!itemExists) {
        return res.status(404).json({
            success: false,
            message: "Product not found in cart"
        });
    }

    cart.items = cart.items.filter(
        item =>
            !(
                item.product.toString() === productId.toString() &&
                item.size === size &&
                item.color === color
            )
    );

    cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.subTotal,
        0
    );

    await cart.save();

    await cart.populate({
        path: "items.product",
        select: "name slug price discountPrice images category subCategory"
    });

    return res.status(200).json({
        success: true,
        message: "Product removed from cart",
        data: cart
    });
});


// ==================== Clear Cart ====================

const clearCart = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const cart = await Cart.findOne({
        _id: id,
        user: req.user._id
    });

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: "Cart not found"
        });
    }

    cart.items = [];

    cart.totalPrice = 0;

    await cart.save();

    return res.status(200).json({
        success: true,
        message: "Cart cleared successfully",
        data: {
            items: [],
            totalPrice: 0
        }
    });
});


module.exports = {
    getCart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart
};