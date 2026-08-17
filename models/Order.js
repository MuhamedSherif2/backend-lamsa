const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        size: {
            type: String,
            trim: true
        },
        color: {
            type: String,
            trim: true
        }
    },
    {
        _id: false
    }
);

const OrderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items: [OrderItemSchema],
        shippingAddress: {
            fullName: { type: String, required: true },
            phoneNumber: { type: String, required: true },
            city: { type: String, required: true },
            address: { type: String, required: true },
            notes: { type: String }
        },
        paymentMethod: {
            type: String,
            enum: ["CashOnDelivery", "CreditCard"],
            default: "CashOnDelivery"
        },
        isPaid: {
            type: Boolean,
            default: false
        },
        paidAt: {
            type: Date
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0
        },
        discountAmount: {
            type: Number,
            default: 0,
            min: 0
        },
        finalPrice: {
            type: Number,
            required: true,
            min: 0
        },
        orderStatus: {
            type: String,
            enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Pending"
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

OrderSchema.index({ user: 1 });
OrderSchema.index({ orderStatus: 1 });

module.exports = mongoose.model("Order", OrderSchema);