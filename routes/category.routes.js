const router = require('express').Router()
const { createCategory, deleteCategory, getAllCategories, getCategoryBySlug, updateCategory } = require('../controllers/category.controller')
const { protect } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/isAdmin')
const upload = require("../middlewares/upload");

router.get("/", getAllCategories);
router.get("/:slug", getCategoryBySlug);

router.post(
    "/",
    protect,
    isAdmin,
    upload.single("image"),
    createCategory
);

router.put(
    "/:id",
    protect,
    isAdmin,
    upload.single("image"),
    updateCategory
);
router.delete("/:id", protect, isAdmin, deleteCategory);

module.exports = router