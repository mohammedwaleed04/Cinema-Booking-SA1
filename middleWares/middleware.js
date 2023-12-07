const jwt = require('jsonwebtoken');
const User = require('../models/user');

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, 'supersecret', async (err, decodedToken) => {
            if(err) {
                res.locals.user = null;
                next();
            }
            else {
                const user = await User.findById(decodedToken.id).lean();
                res.locals.user = user;
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, 'supersecret', (err, decodedToken) => {
            if(err) {
                console.log(err);
                res.redirect('/signin');
            }
            else {
                next();
            }
        })
    }
    else {
        console.log(token);
        res.redirect('/signin');
    }
}

module.exports = {
    requireAuth,
    checkUser
}