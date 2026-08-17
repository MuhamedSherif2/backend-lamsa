const router = require('express').Router()
const { createSubCategory, deleteSubCategory, getAllSubCategories, getSubCategoriesByCategory, getSubCategoryById, updateSubCategory } = require('../controllers/subCategory.controller')
const { protect } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/isAdmin')

router.get("/", getAllSubCategories);
router.get("/:id", getSubCategoryById);
router.get("/category/:categoryId", getSubCategoriesByCategory);

router.post("/", protect, isAdmin, createSubCategory);
router.put("/:id", protect, isAdmin, updateSubCategory);
router.delete("/:id", protect, isAdmin, deleteSubCategory);

module.exports = router