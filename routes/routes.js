const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')
const { requireAuth, checkUser } = require('../middleware/authMiddleware');

router.get('*', checkUser)
router.get('/', requireAuth, (req, res) => res.render("./chat/home.ejs"));
router.get('/login', authController.login_get);
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

module.exports = router;