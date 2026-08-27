const asyncHandler = require("../middlewares/asyncHandler");

const FAQ = require("../models/FAQ");


// ==================== Create FAQ ====================

const createFAQ = asyncHandler(async (req, res) => {

    const { question, answer } = req.body;

    if (!question || !answer) {
        return res.status(400).json({
            success: false,
            message: "Question and answer are required"
        });
    }

    const existingFAQ = await FAQ.findOne({
        question: question.trim(),
        isDeleted: false
    });

    if (existingFAQ) {
        return res.status(400).json({
            success: false,
            message: "FAQ question already exists"
        });
    }

    const faq = await FAQ.create({
        question: question.trim(),
        answer: answer.trim()
    });

    return res.status(201).json({
        success: true,
        message: "FAQ created successfully",
        data: faq
    });
});


// ==================== Get All FAQs ====================

const getAllFAQs = asyncHandler(async (req, res) => {

    const faqs = await FAQ.find({
        isDeleted: false
    }).sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        count: faqs.length,
        data: faqs
    });
});


// ==================== Update FAQ ====================

const updateFAQ = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const { question, answer } = req.body;

    const faq = await FAQ.findOne({
        _id: id,
        isDeleted: false
    });

    if (!faq) {
        return res.status(404).json({
            success: false,
            message: "FAQ not found"
        });
    }

    // Check duplicate question
    if (question !== undefined) {

        const existingFAQ = await FAQ.findOne({
            question: question.trim(),
            _id: { $ne: id },
            isDeleted: false
        });

        if (existingFAQ) {
            return res.status(400).json({
                success: false,
                message: "FAQ question already exists"
            });
        }

        faq.question = question.trim();
    }

    if (answer !== undefined) {
        faq.answer = answer.trim();
    }

    await faq.save();

    return res.status(200).json({
        success: true,
        message: "FAQ updated successfully",
        data: faq
    });
});


// ==================== Delete FAQ ====================

const deleteFAQ = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const faq = await FAQ.findOne({
        _id: id,
        isDeleted: false
    });

    if (!faq) {
        return res.status(404).json({
            success: false,
            message: "FAQ not found"
        });
    }

    faq.isDeleted = true;

    await faq.save();

    return res.status(200).json({
        success: true,
        message: "FAQ deleted successfully",
        data: null
    });
});


module.exports = {
    createFAQ,
    getAllFAQs,
    updateFAQ,
    deleteFAQ
};