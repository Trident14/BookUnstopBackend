const UserBooked = require('../models/UserBooked');
const SeatMap = require('../models/SeatsMap');
const { inMemoryCache } = require('./cacheController');

// Function to initialize seat map if it doesn't exist
const initializeSeatsMap = async () => {
    const existingMap = await SeatMap.findOne({});
    if (!existingMap) {
        const seatMap = Array.from({ length: 12 }, (_, index) => 
            Array(index === 11 ? 3 : 7).fill(null) 
        );
        await SeatMap.create({ rows: seatMap });
    }
};

//Function to book seats
const bookSeats = async (req, res) => {
    const { username, numberOfSeats } = req.body;
    console.log("Received request:", req.body);
  
    // Validate the number of seats to be booked
    if (numberOfSeats < 1 || numberOfSeats > 7) {
        return res.status(400).send("You can book a maximum of 7 seats.");
    }

    let bookedSeats = [];
    let remainingSeats = numberOfSeats;
  
    await initializeSeatsMap();

    const seatMap = await SeatMap.findOne({});
    const rows = seatMap.rows; 

    // Check if there are enough seats available
    while (remainingSeats > 0 && inMemoryCache.rowNumber - 1 < rows.length) {
        currentRow = inMemoryCache.rowNumber - 1;
        let lastAvailableIndex = inMemoryCache.lastAvailableIndex;
        const maxIndex = (currentRow === 11) ? 3 : 7; 
        
        for (let i = lastAvailableIndex; i < maxIndex && remainingSeats > 0; i++) {
            if (rows[currentRow][i] === null) { 
                rows[currentRow][i] = username; 
                bookedSeats.push({ row: currentRow + 1, seat: i + 1 }); 
                remainingSeats--;
                lastAvailableIndex = i + 1; 
                console.log(`Booked seat: Row ${currentRow + 1}, Seat ${i + 1}`);
            }
        }
  
        if (remainingSeats === 0) {           
            inMemoryCache.lastAvailableIndex = lastAvailableIndex; 
            break; 
        } else {
            // If there are remaining seats, check if we reached the last index of the current row
            if (lastAvailableIndex >= maxIndex) {
                // Move to the next row if the last index of the current row is reached
                currentRow++;
                inMemoryCache.rowNumber = currentRow + 1; 
                inMemoryCache.lastAvailableIndex = 0; 
                console.log(`Moving to next row: ${currentRow + 1}`);
            } else {
               
                inMemoryCache.lastAvailableIndex = lastAvailableIndex; 
            }
        }
    }

    // Update the seat map in MongoDB
    await SeatMap.findOneAndUpdate({}, { rows }, { new: true });

    // Save the booking in UserBooked
    if (bookedSeats.length > 0) {
        await UserBooked.create({ username, seats: bookedSeats });
        return res.status(200).send({
            message: "Seats booked successfully",
            seats: bookedSeats
        });
    }

    return res.status(400).send("Not enough seats available.");
};

module.exports = { bookSeats };

