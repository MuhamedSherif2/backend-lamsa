const mongoose = require('mongoose')

const ContactSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            minlength: 2,
            maxlength: 50
        },
        email:{
            type:String,
            required:true,
            minlength: 10,
            maxlength: 80
        },
        phoneNumber:{
            type:String,
            required:true,
            minlength: 10,
            maxlength: 18
        },
        subject:{
            type:String,
            required:true,
            minlength: 2,
            maxlength: 200
        },
        message:{
            type:String,
            required:true,
            minlength: 2,
            maxlength: 200
        },
        isRead:{
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model("Contact", ContactSchema);