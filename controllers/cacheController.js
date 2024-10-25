const CacheModel = require('../models/CacheModel');

let inMemoryCache = {}; // In-memory cache to keep track of seat availability

// Function to load cache from MongoDB
const loadCacheFromMongo = async () => {
    const cacheData = await CacheModel.findOne({}); // Fetch the single cache document
    if (cacheData) {
        inMemoryCache.rowNumber = cacheData.rowNumber;
        inMemoryCache.availableSeats = cacheData.availableSeats;
    } else {
        // If no cache found, initialize it
        inMemoryCache.rowNumber = 1; // Start at row 1
        inMemoryCache.availableSeats = 7; // Start with 7 available seats
    }
};

// Function to save cache to MongoDB on server shutdown
const saveCacheToMongoOnShutdown = async () => {
    await CacheModel.findOneAndUpdate(
        {}, // Find the single cache document (no filter needed)
        {
            rowNumber: inMemoryCache.rowNumber,
            availableSeats: inMemoryCache.availableSeats
        },
        { upsert: true } // Insert if it doesn't exist
    );
};

module.exports = { loadCacheFromMongo, saveCacheToMongoOnShutdown, inMemoryCache };
