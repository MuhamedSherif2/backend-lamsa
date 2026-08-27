const asyncHandler = require("../middlewares/asyncHandler");

const Testimonial = require("../models/Testimonial");


// ==================== Create Testimonial ====================

const createTestimonial = asyncHandler(async (req, res) => {

    const { name, message } = req.body;

    if (!name || !message) {
        return res.status(400).json({
            success: false,
            message: "Name and message are required"
        });
    }

    const testimonial = await Testimonial.create({
        name: name.trim(),
        message: message.trim(),
        isShow: false
    });

    return res.status(201).json({
        success: true,
        message: "Testimonial submitted successfully and is waiting for approval",
        data: testimonial
    });
});


// ==================== Get All Public Testimonials ====================

const getAllTestimonials = asyncHandler(async (req, res) => {

    const testimonials = await Testimonial.find({
        isShow: true,
        isDeleted: false
    }).sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        count: testimonials.length,
        data: testimonials
    });
});


// ==================== Get All Testimonials For Admin ====================

const getAdminTestimonials = asyncHandler(async (req, res) => {

    const testimonials = await Testimonial.find({
        isDeleted: false
    }).sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        count: testimonials.length,
        data: testimonials
    });
});


// ==================== Update Testimonial Status ====================

const updateTestimonialStatus = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const { isShow } = req.body;

    if (isShow === undefined) {
        return res.status(400).json({
            success: false,
            message: "isShow is required"
        });
    }

    const testimonial = await Testimonial.findOne({
        _id: id,
        isDeleted: false
    });

    if (!testimonial) {
        return res.status(404).json({
            success: false,
            message: "Testimonial not found"
        });
    }

    testimonial.isShow =
        isShow === true || isShow === "true";

    await testimonial.save();

    return res.status(200).json({
        success: true,
        message: testimonial.isShow
            ? "Testimonial is now visible"
            : "Testimonial is now hidden",
        data: testimonial
    });
});


// ==================== Delete Testimonial ====================

const deleteTestimonial = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const testimonial = await Testimonial.findOne({
        _id: id,
        isDeleted: false
    });

    if (!testimonial) {
        return res.status(404).json({
            success: false,
            message: "Testimonial not found"
        });
    }

    testimonial.isDeleted = true;

    await testimonial.save();

    return res.status(200).json({
        success: true,
        message: "Testimonial deleted successfully",
        data: null
    });
});


module.exports = {
    createTestimonial,
    getAllTestimonials,
    getAdminTestimonials,
    updateTestimonialStatus,
    deleteTestimonial
};