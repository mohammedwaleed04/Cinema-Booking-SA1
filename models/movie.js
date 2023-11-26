const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title field is required']
    },
    // picture: {
    //     data: Buffer,
    //     contentType: String
    // },
    description: {
        type: String,
        required: [true, 'Review field is required']
    },
    rating: {
        type: Number,
        required: [true, 'Rating field is required'],
        min: [0, 'Rating must be a number between 0 and 10'],
        max: [10, 'Rating must be a number between 0 and 10']
    }
})

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;