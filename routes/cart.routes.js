const router = require('express').Router()
const { addToCart, clearCart, getCart, removeFromCart, updateCartItemQuantity } = require('../controllers/cart.controller')
const { protect } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/isAdmin')

router.use(protect);

router.get("/", getCart);
router.post("/", addToCart);
router.put("/", updateCartItemQuantity);
router.delete("/item/:productId", removeFromCart);
router.delete("/", clearCart);

module.exports = router