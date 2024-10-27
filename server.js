const express = require('express');
const cors = require('cors'); 
const connectMongo = require('./config/db');
const bookingRoutes = require('./routes/bookingRoutes'); 
const SeatMap = require('./models/SeatsMap');
const { saveCacheToMongoOnShutdown } = require('./controllers/cacheController');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT ;
// Connect to MongoDB
connectMongo();

// Middleware
app.use(cors()); 
app.use(express.json());

// API to book seat
app.use('/api', bookingRoutes); 

// API to fetch seats
app.get('/seats', async (req, res) => {
    const seatMap = await SeatMap.findOne({});
    if (seatMap) {
        const formattedSeats = seatMap.rows.map((row, rowIndex) => {
            return row.map((seat, seatIndex) => {
                return {
                    row: rowIndex + 1, 
                    seat: seatIndex + 1, 
                    booked: seat !== null 
                };
            });
        }).flat(); 

        const groupBySeat = formattedSeats.reduce((acc, curSeat) => {
            const { row, seat, booked } = curSeat;
            if (!acc[row]) {
                acc[row] = [];
            }
            acc[row].push({ seat, booked });
            return acc;
        }, {});

        return res.json(groupBySeat);
    }
    return res.status(404).send("Seat map not found.");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors'); 
const connectMongo = require('./config/db');
const bookingRoutes = require('./routes/bookingRoutes'); 
const SeatMap = require('./models/SeatsMap');
const { saveCacheToMongoOnShutdown } = require('./controllers/cacheController');

const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
connectMongo();

app.use(cors()); 
app.use(express.json());

//API to book seat
app.use('/api', bookingRoutes); 

//API to fetch seats
app.get('/seats', async (req, res) => {
    const seatMap = await SeatMap.findOne({});
    if (seatMap) {
        const formattedSeats = seatMap.rows.map((row, rowIndex) => {
            return row.map((seat, seatIndex) => {
                return {
                    row: rowIndex + 1, 
                    seat: seatIndex + 1, 
                    booked: seat !== null 
                };
            });
        }).flat(); 

        const groupBySeat = formattedSeats.reduce((acc, curSeat) => {
            const { row, seat, booked } = curSeat;
            if (!acc[row]) {
                acc[row] = [];
            }
            acc[row].push({ seat, booked });
            return acc;
        }, {});

        return res.json(groupBySeat);
    }
    return res.status(404).send("Seat map not found.");
});

// Graceful shutdown function
const gracefulShutdown = async () => {
    console.log("Gracefully shutting down...");
    try {
        await saveCacheToMongoOnShutdown(); // Save cache to MongoDB
        console.log("Cache saved to MongoDB. Shutting down server.");
        process.exit(0);
    } catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
    }
};

// Attach shutdown handlers for SIGINT and SIGTERM
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

