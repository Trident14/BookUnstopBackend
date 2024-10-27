const mongoose = require('mongoose');

const userBookedSchema = new mongoose.Schema({
    username: { type: String, required: true },
    seats: [{ row: Number, seat: Number }] 
});

module.exports = mongoose.model('UserBooked', userBookedSchema);
