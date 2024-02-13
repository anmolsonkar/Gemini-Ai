const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwt_secret = process.env.JWT_SECRET;
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(
      token,
      jwt_secret,
      async (err, decodedToken) => {
        if (err) {
          res.json({ status: false });
          next();
        } else {
          const user = await User.findById(decodedToken.id);
          if (user) res.json({ status: true, user: user.email });
          else res.json({ status: false });
          next();
        }
      }
    );
  } else {
    res.json({ status: false });
    next();
  }
};

module.exports = { checkUser };


