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

    const { productId, quantity } = req.body;

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

    // Check Product
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

    // Get Product Price
    const productPrice =
        product.discountPrice > 0
            ? product.discountPrice
            : product.price;

    // Find Cart
    let cart = await Cart.findOne({
        user: req.user._id
    });

    // Create Cart
    if (!cart) {

        const subTotal = productPrice * itemQuantity;

        cart = await Cart.create({
            user: req.user._id,
            items: [
                {
                    product: productId,
                    quantity: itemQuantity,
                    price: productPrice,
                    subTotal
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

    // Check if product already exists
    const existingItem = cart.items.find(
        item => item.product.toString() === productId.toString()
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
            subTotal: productPrice * itemQuantity
        });
    }

    // Recalculate Total
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

    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
        return res.status(400).json({
            success: false,
            message: "Product ID and quantity are required"
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
        user: req.user._id
    });

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: "Cart not found"
        });
    }

    const item = cart.items.find(
        item => item.product.toString() === productId.toString()
    );

    if (!item) {
        return res.status(404).json({
            success: false,
            message: "Product not found in cart"
        });
    }

    // Get current Product
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

    // Recalculate Total
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
        item => item.product.toString() === productId.toString()
    );

    if (!itemExists) {
        return res.status(404).json({
            success: false,
            message: "Product not found in cart"
        });
    }

    cart.items = cart.items.filter(
        item => item.product.toString() !== productId.toString()
    );

    // Recalculate Total
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

    const cart = await Cart.findOne({
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