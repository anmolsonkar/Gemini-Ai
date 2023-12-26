const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    res.render("./chat/home.ejs",);
});

router.get('/login', (req, res) => {
    res.render("./auth/login.ejs");
})

router.get('/signup', (req, res) => {
    res.render("./auth/signup.ejs");
})


router.post('/signup', (req, res) => {

    res.redirect("/login")

})

router.post('/login', (req, res) => {
    res.redirect("/")

})

module.exports = router;