const router = require('express').Router()
const { applyCoupon,createCoupon,deleteCoupon,getAllCoupons,getCouponById,updateCoupon } = require('../controllers/coupon.controller')
const { protect } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/isAdmin')

router.post("/apply", protect, applyCoupon);

router.get("/", protect, isAdmin, getAllCoupons);
router.get("/:id", protect, isAdmin, getCouponById);
router.post("/", protect, isAdmin, createCoupon);
router.put("/:id", protect, isAdmin, updateCoupon);
router.delete("/:id", protect, isAdmin, deleteCoupon);

module.exports = router