const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 200
        },

        message: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 200
        },

        isShow: {
            type: Boolean,
            default: false
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

module.exports = mongoose.model("Testimonial", TestimonialSchema);