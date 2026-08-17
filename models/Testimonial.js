const mongoose = require('mongoose')

const TestimonialSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required:true,
            minlength: 2,
            maxlength: 200
        },
        message: {
            type:String,
            required:true,
            minlength: 2,
            maxlength: 200
        },
        // rating: {

        // },
        isShow: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Testimonials", TestimonialSchema);