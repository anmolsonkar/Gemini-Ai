const User = require('../models/user')
const jwt = require('jsonwebtoken')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'gemini ai secret', (error, decodedToken) => {
            if (error) {
                res.redirect('/login')
            }
            else {
                next();
            }
        })
    } else {
        res.redirect('/login')
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'gemini ai secret', async (error, decodedToken) => {
            if (error) {
                res.locals.user = null;
                next();
            }
            else {
                let user = await User.findById(decodedToken.id)
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next()
    }

};


module.exports = {
    requireAuth,
    checkUser
}