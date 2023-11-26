const User = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const maxAge = 60*60*0.5;
const createToken = (id) => {
    return jwt.sign({id}, 'supersecret', {expiresIn: maxAge});
}

const home_get = (req, res) => {
    res.render("index")
}

const signupErrors = (err) => {
    const errors = {name: '', email: '', password: ''}
    if(err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }
    else if(err.message.includes('name') && err.code === 11000){
        errors.name = 'this name is already used';
    }
    else{
        errors.email = 'this email is already registered';
    }
    return errors;
}

const loginErrors = (err) => {
    const errors = {email: '', password: ''}
    if(err.message.includes('Email')){
        errors.email = err.message;
    }
    else{
        errors.password = err.message;
    }
    return errors;
}

const signin_get = (req, res) => {
    res.render('sign_in');
}

const signup_post = async (req, res) => {
    try {
        const user = await User.create(req.body);
        const token = createToken(user._id);
        res.cookie('jwt', token, {maxAge: maxAge*1000, httpOnly: true});
        res.json({user: user});
    }
    catch (err) {
        const errors = signupErrors(err);
        res.json({errors});
    }
}

const login_post = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                const token = createToken(user._id);
                res.cookie('jwt', token, {maxAge: maxAge*1000, httpOnly: true});
                res.json({email: user.email, token: token});
                return;
            }
            throw Error('Password is incorrect');
        }
        throw Error('Email is incorrect');
    }
    catch (err) {
        const errors = loginErrors(err);
        res.json({errors});
    }
}

const logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/signin');
}

module.exports = {
    home_get,
    signin_get,
    signup_post,
    login_post,
    logout_get
}