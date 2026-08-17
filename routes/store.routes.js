const router = require('express').Router()
const { addStoreSettings,updateStoreSettings, getStoreSettings } = require('../controllers/store.controller')
const { protect } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/isAdmin')

router.get("/", getStoreSettings);
router.put("/", protect, isAdmin, updateStoreSettings);
module.exports = router