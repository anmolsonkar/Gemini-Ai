const User = require('../models/user')
const jwt = require('jsonwebtoken')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'gemini ai secret', (error, decodedToken) => {
            if (error) {
                console.log(error.message)
                res.redirect('/login')
            }
            else {
                console.log(decodedToken)
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
                console.log(error.message)
                res.locals.user = null;
                next();
            }
            else {
                console.log(decodedToken)
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