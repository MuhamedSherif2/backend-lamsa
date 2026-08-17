const router = require('express').Router()
const { createBanner,deleteBanner,getAllBanners,updateBanner } = require('../controllers/banner.controller')
const { protect } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/isAdmin')

router.get("/", getAllBanners);

router.post("/", protect, isAdmin, createBanner);
router.put("/:id", protect, isAdmin, updateBanner);
router.delete("/:id", protect, isAdmin, deleteBanner);

module.exports = router