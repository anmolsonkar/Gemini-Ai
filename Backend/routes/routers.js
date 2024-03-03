const { signup_post, login_post, deleteChatById} = require("../controllers/authController.js");
const { checkUser } = require("../middleware/authMiddleware.js");

const router = require("express").Router();

router.post('/', checkUser);
router.post('/signup', signup_post);
router.post('/login', login_post);
router.post('/chat/:id', deleteChatById);

module.exports = router;
