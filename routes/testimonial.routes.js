const router = require('express').Router()
const { createTestimonial,deleteTestimonial,getAdminTestimonials,getAllTestimonials,updateTestimonialStatus } = require('../controllers/testimonial.controller')
const { protect } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/isAdmin')

router.get("/", getAllTestimonials);
router.post("/", protect, createTestimonial);

router.get("/admin/all", protect, isAdmin, getAdminTestimonials);
router.put("/:id/status", protect, isAdmin, updateTestimonialStatus);
router.delete("/:id", protect, isAdmin, deleteTestimonial);

module.exports = router