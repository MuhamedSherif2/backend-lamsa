const mongoose = require('mongoose')

const StoreSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required:true,
        },
        logo: {
            type:String,
            required:true,
        },
        phoneNumber: {
            type:String,
            required:true,
        },
        email: {
            type:String,
            required:true,
        },
        address: {
            type:String,
            required:true,
        },
        facebook: {
            type:String,
            required:true,
        },
        instagram: {
            type:String,
            required:true,
        },
        tiktok: {
            type:String,
            required:true,
        },
        shippingPolicy: {
            type:String,
            required:true,
        },
        returnPolicy: {
            type:String,
            required:true,
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Store", StoreSchema);