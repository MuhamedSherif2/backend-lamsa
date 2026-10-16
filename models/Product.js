const mongoose = require("mongoose");
const imageSchema = require("./schemas/image.schema");

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 200
        },

        sizes: {
            type: [String],
            required: true,
            validate: {
                validator: (sizes) =>
                    sizes.length > 0 &&
                    sizes.every((size) => size.trim().length > 0),
                message: "Product must have at least one valid size"
            }
        },

        colors: {
            type: [String],
            required: true,
            validate: {
                validator: (colors) =>
                    colors.length > 0 &&
                    colors.every((color) => color.trim().length > 0),
                message: "Product must have at least one valid color"
            }
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        discountPrice: {
            type: Number,
            default: 0,
            min: 0
        },

        stock: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },

        images: {
            type: [imageSchema],
            required: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubCategory",
            required: true
        },

        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },

        numReviews: {
            type: Number,
            default: 0
        },

        isFeatured: {
            type: Boolean,
            default: false
        },

        isActive: {
            type: Boolean,
            default: true
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

ProductSchema.index({ category: 1 });
ProductSchema.index({ subCategory: 1 });

module.exports = mongoose.model("Product", ProductSchema);