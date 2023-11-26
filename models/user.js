const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: [isEmail, 'Email is incorrect']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'minimum length is 6 characters']
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

const User = mongoose.model('User', userSchema);
module.exports = User;