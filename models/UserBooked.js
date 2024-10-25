const mongoose = require('mongoose');

const userBookedSchema = new mongoose.Schema({
    username: { type: String, required: true },
    seats: [{ row: Number, seat: Number }] // Array of seat objects with row and seat number
});

module.exports = mongoose.model('UserBooked', userBookedSchema);
