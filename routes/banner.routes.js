const router = require("express").Router();

const {
    createBanner,
    deleteBanner,
    getAllBanners,
    updateBanner
} = require("../controllers/banner.controller");

const { protect } = require("../middlewares/auth");
const { isAdmin } = require("../middlewares/isAdmin");
const upload = require("../middlewares/upload");

router.get("/", getAllBanners);

router.post(
    "/",
    protect,
    isAdmin,
    upload.single("image"),
    createBanner
);

router.put(
    "/:id",
    protect,
    isAdmin,
    upload.single("image"),
    updateBanner
);

router.delete(
    "/:id",
    protect,
    isAdmin,
    deleteBanner
);

module.exports = router;