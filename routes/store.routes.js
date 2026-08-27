const router = require("express").Router();

const {
    addStoreSettings,
    getStoreSettings,
    updateStoreSettings
} = require("../controllers/store.controller");

const { protect } = require("../middlewares/auth");
const { isAdmin } = require("../middlewares/isAdmin");

router.get("/", getStoreSettings);

router.post("/", protect, isAdmin, addStoreSettings);

router.put("/", protect, isAdmin, updateStoreSettings);

module.exports = router;