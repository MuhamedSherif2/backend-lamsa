const mongoose = require('mongoose')
const imageSchema = require("./schemas/image.schema");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },

    slug: {
        type: String,
        required: true,
        unique: true
    },

    image: {
        type: imageSchema,
        required: true
    },

    isDeleted: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema)