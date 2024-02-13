const { signup_post, login_post } = require("../controllers/authController.js");
const { checkUser } = require("../middleware/authMiddleware.js");

const router = require("express").Router();

router.post('/', checkUser);
router.post('/signup', signup_post);
router.post('/login', login_post);

module.exports = router;
