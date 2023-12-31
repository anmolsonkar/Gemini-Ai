const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

router.get('/', async (req, res) => {
    res.render("./chat/home.ejs",);
});

router.get('/login', authController.login_get)
router.get('/signup', authController.signup_get)
router.post('/signup', authController.signup_post)
router.post('/login', authController.login_post)

module.exports = router;