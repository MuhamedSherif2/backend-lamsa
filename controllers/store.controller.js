const asyncHandler = require("../middlewares/asyncHandler");

const Store = require("../models/Store");


// ==================== Add Store Settings ====================

const addStoreSettings = asyncHandler(async (req, res) => {

    const {
        name,
        logo,
        phoneNumber,
        email,
        address,
        facebook,
        instagram,
        tiktok,
        shippingPolicy,
        returnPolicy
    } = req.body;

    // Check if store settings already exist
    const existingStore = await Store.findOne();

    if (existingStore) {
        return res.status(400).json({
            success: false,
            message: "Store settings already exist"
        });
    }

    if (
        !name ||
        !logo ||
        !phoneNumber ||
        !email ||
        !address ||
        !facebook ||
        !instagram ||
        !tiktok ||
        !shippingPolicy ||
        !returnPolicy
    ) {
        return res.status(400).json({
            success: false,
            message: "All store settings fields are required"
        });
    }

    const store = await Store.create({
        name: name.trim(),
        logo: logo.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim().toLowerCase(),
        address: address.trim(),
        facebook: facebook.trim(),
        instagram: instagram.trim(),
        tiktok: tiktok.trim(),
        shippingPolicy: shippingPolicy.trim(),
        returnPolicy: returnPolicy.trim()
    });

    return res.status(201).json({
        success: true,
        message: "Store settings created successfully",
        data: store
    });
});


// ==================== Get Store Settings ====================

const getStoreSettings = asyncHandler(async (req, res) => {

    const store = await Store.findOne();

    if (!store) {
        return res.status(404).json({
            success: false,
            message: "Store settings not found"
        });
    }

    return res.status(200).json({
        success: true,
        data: store
    });
});


// ==================== Update Store Settings ====================

const updateStoreSettings = asyncHandler(async (req, res) => {

    const {
        name,
        logo,
        phoneNumber,
        email,
        address,
        facebook,
        instagram,
        tiktok,
        shippingPolicy,
        returnPolicy
    } = req.body;

    const store = await Store.findOne();

    if (!store) {
        return res.status(404).json({
            success: false,
            message: "Store settings not found"
        });
    }

    if (name !== undefined) {
        store.name = name.trim();
    }

    if (logo !== undefined) {
        store.logo = logo.trim();
    }

    if (phoneNumber !== undefined) {
        store.phoneNumber = phoneNumber.trim();
    }

    if (email !== undefined) {
        store.email = email.trim().toLowerCase();
    }

    if (address !== undefined) {
        store.address = address.trim();
    }

    if (facebook !== undefined) {
        store.facebook = facebook.trim();
    }

    if (instagram !== undefined) {
        store.instagram = instagram.trim();
    }

    if (tiktok !== undefined) {
        store.tiktok = tiktok.trim();
    }

    if (shippingPolicy !== undefined) {
        store.shippingPolicy = shippingPolicy.trim();
    }

    if (returnPolicy !== undefined) {
        store.returnPolicy = returnPolicy.trim();
    }

    await store.save();

    return res.status(200).json({
        success: true,
        message: "Store settings updated successfully",
        data: store
    });
});


module.exports = {
    addStoreSettings,
    getStoreSettings,
    updateStoreSettings
};