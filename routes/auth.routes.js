const router = require('express').Router()
const { register, login, forgotPassword, resetPassword, verifyEmail } = require('../controllers/auth.controller')
const { protect } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/isAdmin')

// router.use(protect);

router.post("/register", register);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);

module.exports = router