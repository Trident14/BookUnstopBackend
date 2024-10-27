const mongoose = require('mongoose');

const cacheModelSchema = new mongoose.Schema({
    rowNumber: { type: Number, required: true }, 
    lastAvailableIndex: { type: Number, required: true } 
});

module.exports = mongoose.model('CacheModel', cacheModelSchema);
