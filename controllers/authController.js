const User = require('../models/user')
const jwt = require('jsonwebtoken');


const handleErrors = (error) => {

    let errors = { email: '', password: '' };

    if (error.message === 'incorrect email') {
        errors.email = "That email is not registered";
    }

    if (error.message === 'incorrect password') {
        errors.password = "That password is incorrect";
    }

    if (error.message === 'not matched') {
        errors.password = "Passwords did not match";
    }

    if (error.code === 11000) {
        errors.email = 'That email is already exists';
        return errors;
    }

    if (error.message.includes("user validation failed")) {
        Object.values(error.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, 'gemini ai secret', {
        expiresIn: maxAge
    })
}

const signup_get = (req, res) => {
    res.render("./auth/signup.ejs");
}

const login_get = (req, res) => {
    res.render("./auth/login.ejs");
}

const signup_post = async (req, res) => {

    const { email, password, cpassword } = req.body;

    try {

        if (password !== cpassword) {
            throw new Error("not matched")
        }

        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });

    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({ errors });
    }
};

const login_post = async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user: user._id });

    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({ errors });
    }

}

const logout_get = async (req, res) => {

    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');

}


module.exports = {
    signup_get,
    login_get,
    signup_post,
    login_post,
    logout_get
}