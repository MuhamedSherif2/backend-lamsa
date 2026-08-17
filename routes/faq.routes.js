const router = require('express').Router()
const { createFAQ,deleteFAQ,getAllFAQs,updateFAQ } = require('../controllers/faq.controller')
const { protect } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/isAdmin')

router.get("/", getAllFAQs);

router.post("/", protect, isAdmin, createFAQ);
router.put("/:id", protect, isAdmin, updateFAQ);
router.delete("/:id", protect, isAdmin, deleteFAQ);

module.exports = router