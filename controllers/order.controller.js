const asyncHandler = require("../middlewares/asyncHandler");

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");


// ==================== Create Order ====================

const createOrder = asyncHandler(async (req, res) => {

    const {
        shippingAddress,
        paymentMethod,
        couponCode
    } = req.body;

    // Validate Shipping Address

    if (
        !shippingAddress ||
        !shippingAddress.fullName ||
        !shippingAddress.phoneNumber ||
        !shippingAddress.city ||
        !shippingAddress.address
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Full name, phone number, city and address are required"
        });
    }

    // Validate Payment Method

    if (
        paymentMethod &&
        !["CashOnDelivery", "CreditCard"].includes(paymentMethod)
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid payment method"
        });
    }

    // Get User Cart

    const cart = await Cart.findOne({
        user: req.user._id
    });

    if (!cart || cart.items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Cart is empty"
        });
    }

    // Check Products

    const productIds = cart.items.map(item => item.product);

    const products = await Product.find({
        _id: { $in: productIds },
        isDeleted: false,
        isActive: true
    });

    if (products.length !== cart.items.length) {
        return res.status(400).json({
            success: false,
            message: "One or more products are no longer available"
        });
    }

    // Create Order Items

    const orderItems = cart.items.map(item => {

        const product = products.find(
            product =>
                product._id.toString() === item.product.toString()
        );

        return {
            product: product._id,
            quantity: item.quantity,
            price: product.discountPrice > 0
                ? product.discountPrice
                : product.price
        };
    });

    // Calculate Total Price

    const totalPrice = orderItems.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    // Apply Coupon

    let discountAmount = 0;
    let appliedCouponCode;

    if (couponCode) {

        const code = couponCode.trim().toUpperCase();

        const coupon = await Coupon.findOne({
            code,
            isActive: true,
            isDeleted: false,
            expireDate: {
                $gt: new Date()
            }
        });

        if (!coupon) {
            return res.status(400).json({
                success: false,
                message: "Invalid, inactive or expired coupon"
            });
        }

        discountAmount =
            (totalPrice * coupon.discountPercentage) / 100;

        appliedCouponCode = coupon.code;
    }

    // Calculate Final Price

    const finalPrice = totalPrice - discountAmount;

    // Create Order

    const order = await Order.create({
        user: req.user._id,

        items: orderItems,

        shippingAddress,

        paymentMethod:
            paymentMethod || "CashOnDelivery",

        isPaid: false,

        totalPrice,

        discountAmount,

        couponCode: appliedCouponCode,

        finalPrice,

        orderStatus: "Pending"
    });

    // Clear Cart

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    const populatedOrder = await Order.findById(order._id)
        .populate("user", "name email phoneNumber")
        .populate("items.product", "name slug images price discountPrice");

    return res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: populatedOrder
    });
});


// ==================== Get My Orders ====================

const getMyOrders = asyncHandler(async (req, res) => {

    const orders = await Order.find({
        user: req.user._id,
        isDeleted: false
    })
        .populate(
            "items.product",
            "name slug images price discountPrice"
        )
        .sort({
            createdAt: -1
        });

    return res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});


// ==================== Get Order By ID ====================

const getOrderById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const order = await Order.findOne({
        _id: id,
        isDeleted: false
    })
        .populate(
            "user",
            "name email phoneNumber"
        )
        .populate(
            "items.product",
            "name slug images price discountPrice"
        );

    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Order not found"
        });
    }

    // User can only see his own order
    // Admin can see any order

    if (
        req.user.role !== "admin" &&
        order.user._id.toString() !== req.user._id.toString()
    ) {
        return res.status(403).json({
            success: false,
            message: "You are not allowed to view this order"
        });
    }

    return res.status(200).json({
        success: true,
        data: order
    });
});


// ==================== Get All Orders ====================

const getAllOrders = asyncHandler(async (req, res) => {

    const orders = await Order.find({
        isDeleted: false
    })
        .populate(
            "user",
            "name email phoneNumber"
        )
        .populate(
            "items.product",
            "name slug images price discountPrice"
        )
        .sort({
            createdAt: -1
        });

    return res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});


// ==================== Update Order Status ====================

const updateOrderStatus = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { orderStatus } = req.body;

    const allowedStatuses = [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
    ];

    if (!orderStatus) {
        return res.status(400).json({
            success: false,
            message: "Order status is required"
        });
    }

    if (!allowedStatuses.includes(orderStatus)) {
        return res.status(400).json({
            success: false,
            message: "Invalid order status"
        });
    }

    const order = await Order.findOne({
        _id: id,
        isDeleted: false
    });

    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Order not found"
        });
    }

    order.orderStatus = orderStatus;

    // If order is delivered, mark it as paid
    // only if payment method is CashOnDelivery

    if (
        orderStatus === "Delivered" &&
        order.paymentMethod === "CashOnDelivery"
    ) {
        order.isPaid = true;
        order.paidAt = new Date();
    }

    await order.save();

    return res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        data: order
    });
});


// ==================== Cancel Order ====================

const cancelOrder = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const order = await Order.findOne({
        _id: id,
        user: req.user._id,
        isDeleted: false
    });

    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Order not found"
        });
    }

    // Customer cannot cancel after order is shipped
    if (
        order.orderStatus === "Shipped" ||
        order.orderStatus === "Delivered" ||
        order.orderStatus === "Cancelled"
    ) {
        return res.status(400).json({
            success: false,
            message: "You cannot cancel this order after it has been shipped"
        });
    }

    order.orderStatus = "Cancelled";

    await order.save();

    return res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        data: order
    });
});

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
};