const mongoose = require('mongoose');

const cacheModelSchema = new mongoose.Schema({
    rowNumber: { type: Number, required: true }, // Current row number
    lastAvailableIndex: { type: Number, required: true } // Last available seat index in the current row
});

module.exports = mongoose.model('CacheModel', cacheModelSchema);
