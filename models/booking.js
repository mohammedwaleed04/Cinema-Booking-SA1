const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'this field is required']
    },
    movie: {
        type: String,
        required: [true, 'this field is required']
    },
    cinema: {
        type: String,
        required: [true, 'this field is required']
    },
    day: {
        type: String,
        required: [true, 'this field is required']
    },
    hour: {
        type: String,
        required: [true, 'this field is required']
    },
    screen: {
        type: Number,
        required: [true, 'this field is required']
    },
    seat: {
        type: [Number],
        default: []
    },
    food: {
        type: [String],
        default: []
    },
    cardName: {
        type: String,
        required: [true, 'this field is required']
    },
    cardNumber: {
        type: String,
        required: [true, 'this field is required']
    },
    expirationDate: {
        type: String,
        required: [true, 'this field is required']
    },
    cvv: {
        type: Number,
        required: [true, 'this field is required']
    },
    cost: {
        type: Number,
        required: [true, 'this field is required']
    }
})

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;