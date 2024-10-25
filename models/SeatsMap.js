const mongoose = require('mongoose');
const seatMapSchema = new mongoose.Schema({
    rows: {
      type: [[String]], // Array of arrays of strings
      default: Array.from({ length: 12 }, (_, index) => Array(index === 11 ? 3 : 7).fill(null))
    }
  });
  
  const SeatMap = mongoose.model('SeatMap', seatMapSchema);
  
  module.exports = SeatMap;