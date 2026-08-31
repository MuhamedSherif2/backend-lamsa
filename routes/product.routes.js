const router = require('express').Router()
const { createProduct, deleteProduct, getAllProducts, getProductById, getProductBySlug, updateProduct } = require('../controllers/product.controller')
const { protect } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/isAdmin');
const upload = require('../middlewares/upload');

router.get("/", getAllProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);

router.post("/", protect, isAdmin, upload.array("images", 5), createProduct);
router.put("/:id", protect, isAdmin, upload.array("images", 5), updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);

module.exports = router