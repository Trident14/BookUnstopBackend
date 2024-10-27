const mongoose = require('mongoose');
const { loadCacheFromMongo, saveCacheToMongoOnShutdown } = require('../controllers/cacheController');
const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected');
    await loadCacheFromMongo();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); 
  }
};

module.exports = connectMongo;
