const mongoose = require('mongoose');

const cacheModelSchema = new mongoose.Schema({
    rowNumber: { type: Number, required: true },
    availableSeats: { type: Number, required: true } // Number of available seats in that row
});

module.exports = mongoose.model('CacheModel', cacheModelSchema);
