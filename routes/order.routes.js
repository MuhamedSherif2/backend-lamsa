const router = require('express').Router()
const { cancelOrder, createOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus } = require('../controllers/order.controller')
const { protect } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/isAdmin')

router.use(protect);

router.post("/", createOrder);
router.get("/my-orders", getMyOrders);
router.get("/:id", getOrderById);
router.put("/:id/cancel", cancelOrder);

router.get("/", isAdmin, getAllOrders);
router.put("/:id/status", isAdmin, updateOrderStatus);

module.exports = router