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

        // brand: {
        //     type: String,
        //     trim: true,
        //     maxlength: 100
        // },

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