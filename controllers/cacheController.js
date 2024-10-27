const CacheModel = require('../models/CacheModel');

// In-memory cache to keep track of seat availability
let inMemoryCache = {
    rowNumber: 1,             
    lastAvailableIndex: 0     
};

// Function to load cache from MongoDB
const loadCacheFromMongo = async () => {
    const cacheData = await CacheModel.findOne({}); 
    if (cacheData) {
       
        inMemoryCache.rowNumber = cacheData.rowNumber || inMemoryCache.rowNumber; 
        inMemoryCache.lastAvailableIndex = cacheData.lastAvailableIndex || inMemoryCache.lastAvailableIndex; 
    } 
};

// Function to save cache to MongoDB on server shutdown
const saveCacheToMongoOnShutdown = async () => {
    console.log("Saving Cache - Row Number:", inMemoryCache.rowNumber);
    console.log("Saving Cache - Last Available Index:", inMemoryCache.lastAvailableIndex);
    await CacheModel.findOneAndUpdate(
        {}, 
        {
            rowNumber: inMemoryCache.rowNumber,
            lastAvailableIndex: inMemoryCache.lastAvailableIndex
        },
        { upsert: true } 
    );
};

module.exports = { loadCacheFromMongo, saveCacheToMongoOnShutdown, inMemoryCache };
