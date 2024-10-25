const mongoose = require('mongoose');

const SeatsMapSchema = new mongoose.Schema({
    row: { type: Number, required: true },
    availableSeats: { type: Number, required: true }
});

module.exports = mongoose.model('SeatsMap', SeatsMapSchema);
