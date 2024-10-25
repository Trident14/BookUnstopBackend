const CacheModel = require('../models/CacheModel');

// In-memory cache to keep track of seat availability
let inMemoryCache = {
    rowNumber: 1,             // Default starting row number
    lastAvailableIndex: 0     // Default starting available seats for rows 1-11, 3 for row 12
};

// Function to load cache from MongoDB
const loadCacheFromMongo = async () => {
    const cacheData = await CacheModel.findOne({}); // Fetch the single cache document
    if (cacheData) {
        // Load values from the database into the in-memory cache
        inMemoryCache.rowNumber = cacheData.rowNumber || inMemoryCache.rowNumber; // Default to existing value if not found
        inMemoryCache.lastAvailableIndex = cacheData.lastAvailableIndex || inMemoryCache.lastAvailableIndex; // Default to existing value if not found
    } 
    // No need to initialize it here; default values are already set
};

// Function to save cache to MongoDB on server shutdown
const saveCacheToMongoOnShutdown = async () => {
    console.log("Saving Cache - Row Number:", inMemoryCache.rowNumber);
    console.log("Saving Cache - Last Available Index:", inMemoryCache.lastAvailableIndex);
    await CacheModel.findOneAndUpdate(
        {}, // Find the single cache document (no filter needed)
        {
            rowNumber: inMemoryCache.rowNumber,
            lastAvailableIndex: inMemoryCache.lastAvailableIndex
        },
        { upsert: true } // Insert if it doesn't exist
    );
};

module.exports = { loadCacheFromMongo, saveCacheToMongoOnShutdown, inMemoryCache };
