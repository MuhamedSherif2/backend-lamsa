const router = require('express').Router()
const { createCategory, deleteCategory,getAllCategories,getCategoryById,updateCategory } = require('../controllers/category.controller')
const { protect } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/isAdmin')

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

router.post("/", protect, isAdmin, createCategory);
router.put("/:id", protect, isAdmin, updateCategory);
router.delete("/:id", protect, isAdmin, deleteCategory);

module.exports = router