const express = require('express');
const connectMongo = require('./config/db');
const bookingRoutes = require('./routes/bookingRoutes'); // Correctly import the routes
const { saveCacheToMongoOnShutdown } = require('./controllers/cacheController');

const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;
connectMongo();

app.use(express.json());

app.use('/api', bookingRoutes); // Register the booking routes

const startServer = async () => {
    try {

        // Handle server shutdown
        process.on('SIGINT', async () => {
            await saveCacheToMongoOnShutdown(); // Save cache to MongoDB
            process.exit(0);
        });

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
    }
};

startServer();
