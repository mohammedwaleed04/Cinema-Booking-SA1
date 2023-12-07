const User = require("../models/user");
const Booking = require("../models/booking");
const Movie = require("../models/movie")
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const maxAge = 60*60*0.5;
const createToken = (id) => {
    return jwt.sign({id}, 'supersecret', {expiresIn: maxAge});
}

const home_get = (req, res) => {
    Movie.find().sort({ _id: -1 }).limit(4).lean()
    .then(result => res.render('index', {title: 'Movies', movies: result}))
    .catch(err => console.log(err));
}

const about_get = (req, res) => {
    res.render("about");
}

const search_get = async (req, res) => {
    const searchQuery = req.query.s;  
    try {
        const movies = await Movie.find({ title: { $regex: searchQuery, $options: 'i' } }).lean();
        res.render('search', { title: 'Search Results', movies });
    } 
    catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
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

const booking_get = (req, res) => {
    const short = req.params.id;
    Movie.findOne({ stitle: short }).lean()
    .then(result => res.render('booking', {title: 'Movies', movies: result}))
    .catch(err => console.log(err));
}

const booking_post = async (req, res) => {
    const movie = req.params.id;
    const body = req.body;
    const booking = {movie, ...body};
    try {
        const user = await Booking.create(booking);
        res.json({"message": "ticket booked successfully!"});
    }
    catch (err) {
        res.json(err);
    }
}

booking_delete = async (req, res) => {
    const id = req.params.id;
    Booking.findOneAndDelete({_id: id})
    .then(result => res.json({"message": "profile updated successfully"}))
    .catch(err => {
        console.log(err);
    });
}

const movie_post = async (req, res) => {
    const movie = req.body;
    try {
        const user = await Movie.create(movie);
        res.json({"message": "movie added successfully!"});
    }
    catch (err) {
        res.json(err);
    }
}

const movie_get = async (req, res) => {
    Movie.find().sort({ _id: -1 }).lean()
    .then(result => res.render('movies', {title: 'Movies', movies: result}))
    .catch(err => console.log(err));
}

const profile_get = async (req, res) => {
    Booking.find({ username: req.query.username }).lean()
    .then(result => res.render('profile', {title: 'Profile', tickets: result}))
    .catch(err => console.log(err));
}

const profile_update = async (req, res) => {
    User.findOneAndUpdate({name: req.body.username}, req.body, { new: true })
    .then(result => res.json({"message": "profile updated successfully","name":result.name,"email":result.email}))
    .catch(err => {
        console.log(err);
    });
}

module.exports = {
    home_get,
    about_get,
    search_get,
    signin_get,
    signup_post,
    login_post,
    logout_get,
    booking_get,
    booking_post,
    booking_delete,
    movie_post,
    movie_get,
    profile_get,
    profile_update
}