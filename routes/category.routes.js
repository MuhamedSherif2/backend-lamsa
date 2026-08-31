const router = require('express').Router()
const { createCategory, deleteCategory, getAllCategories, getCategoryBySlug, updateCategory } = require('../controllers/category.controller')
const { protect } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/isAdmin')

router.get("/", getAllCategories);
router.get("/:slug", getCategoryBySlug);

router.post("/", protect, isAdmin, createCategory);
router.put("/:id", protect, isAdmin, updateCategory);
router.delete("/:id", protect, isAdmin, deleteCategory);

module.exports = router