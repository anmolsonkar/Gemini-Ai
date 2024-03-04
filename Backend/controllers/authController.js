const User = require('../models/user');
const { History } = require('../models/chat');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const jwt_secret = process.env.JWT_SECRET;

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, jwt_secret, {
        expiresIn: maxAge,
    });
};

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
};

const signup_post = async (req, res, next) => {
    const { email, password, cpassword } = req.body;
    try {
        if (password !== cpassword) {
            throw new Error("not matched");
        }

        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { withCredentials: true, httpOnly: false, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id, created: true });
    } catch (error) {
        const errors = handleErrors(error);
        res.json({ errors, created: false });
    }
};

const login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: false, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id, status: true });
    } catch (error) {
        const errors = handleErrors(error);
        res.json({ errors, status: false });
    }
};


const deleteChatById = async (req, res) => {

    try {

        const deleteFromId = req.params.id;
        await History.findByIdAndDelete(deleteFromId);
        await History.findOneAndDelete({
            _id: {
                $gt: deleteFromId
            }
        })
        res.status(200).json({ message: "Chats deleted successfully", status: true });
    } catch (error) {
        res.status(500).json({ message: "Unable to delete chats", error, status: false });
    }
}

module.exports = {
    signup_post,
    login_post,
    deleteChatById
};
