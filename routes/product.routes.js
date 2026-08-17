const router = require('express').Router()
const { createProduct,deleteProduct,getAllProducts,getProductById,getProductBySlug,updateProduct } = require('../controllers/product.controller')
const { protect } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/isAdmin')

router.get("/", getAllProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);

router.post("/", protect, isAdmin, createProduct);
router.put("/:id", protect, isAdmin, updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);

module.exports = router