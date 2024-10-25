const mongoose = require('mongoose');

const seatMapSchema = new mongoose.Schema({
    // 2D array representing the seating arrangement
    rows: {
        type: [[String]], // Each inner array represents a row of seats
        default: Array.from({ length: 12 }, (_, index) => 
            Array(index === 11 ? 3 : 7).fill(null) // 7 seats for rows 1-11, 3 for row 12
        )
    }
});
  
const SeatMap = mongoose.model('SeatMap', seatMapSchema);
  
module.exports = SeatMap;
