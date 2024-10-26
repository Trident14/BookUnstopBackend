const UserBooked = require('../models/UserBooked');
const SeatMap = require('../models/SeatsMap');
const { inMemoryCache } = require('./cacheController');

// Function to initialize seat map if it doesn't exist
const initializeSeatsMap = async () => {
    const existingMap = await SeatMap.findOne({});
    if (!existingMap) {
        // Create a 2D array with 12 rows, where the 12th row has 3 seats, and others have 7 seats
        const seatMap = Array.from({ length: 12 }, (_, index) => 
            Array(index === 11 ? 3 : 7).fill(null) // 12th row (index 11) gets 3 seats, others get 7
        );

        await SeatMap.create({ rows: seatMap });
    }
};



// Function to book seats
// const bookSeats = async (req, res) => {
//     const { username, numberOfSeats } = req.body;

//     if (numberOfSeats < 1 || numberOfSeats > 7) {
//         return res.status(400).send("You can book a maximum of 7 seats.");
//     }

//     let bookedSeats = [];
//     let remainingSeats = numberOfSeats;
//     let currentRow = inMemoryCache.rowNumber - 1; // Convert to 0-based indexing

//     console.log("Current row (0-based):", currentRow);
//     console.log("current row and avaliable seat before:  %s and %s", currentRow, inMemoryCache.availableSeats);

//     // Ensure SeatsMap is initialized
//     await initializeSeatsMap();

//     const seatMap = await SeatMap.findOne({});
//     const rows = seatMap.rows; // Retrieve the rows from the database

//     // Check if there are enough seats available
//     while (remainingSeats > 0 && currentRow < rows.length) {
//         const availableSeatsInRow = rows[currentRow].filter(seat => seat === null).length;

//         if (availableSeatsInRow >= remainingSeats) {
//             // Book the required seats in the current row
//             for (let i = 0; i < rows[currentRow].length && remainingSeats > 0; i++) {
//                 if (rows[currentRow][i] === null) { // Check for available seat
//                     rows[currentRow][i] = username; // Assign username to the seat
//                     bookedSeats.push({ row: currentRow + 1, seat: i + 1 }); // Store booked seat info (1-based)
//                     remainingSeats--;
//                 }
//             }
//             break; // All seats booked in this row, exit the loop
//         } else {
//             // Book all available seats in the current row and move to the next row
//             for (let i = 0; i < rows[currentRow].length; i++) {
//                 if (rows[currentRow][i] === null) {
//                     rows[currentRow][i] = username; // Assign username to the seat
//                     bookedSeats.push({ row: currentRow + 1, seat: i + 1 }); // Store booked seat info (1-based)
//                     remainingSeats--;
//                 }
//             }
//             currentRow++; // Move to the next row
//         }
//     }

//     // Update the seat map in MongoDB
//     await SeatMap.findOneAndUpdate({}, { rows }, { new: true });

//     // Save the booking in UserBooked
//     if (bookedSeats.length > 0) {
//         await UserBooked.create({ username, seats: bookedSeats });
//         return res.status(200).send({
//             message: "Seats booked successfully",
//             seats: bookedSeats
//         });

//     }
//     console.log("current row and avaliable seat after:  %s and %s", currentRow, inMemoryCache.availableSeats);

//     return res.status(400).send("Not enough seats available.");
// };
//---------------------------------------
// const bookSeats = async (req, res) => {
//     const { username, numberOfSeats } = req.body;

//     // Validate number of seats to be booked
//     if (numberOfSeats < 1 || numberOfSeats > 7) {
//         return res.status(400).send("You can book a maximum of 7 seats.");
//     }

//     let bookedSeats = [];
//     let remainingSeats = numberOfSeats;
//     let currentRow = inMemoryCache.rowNumber - 1; // Convert to 0-based indexing

//     // Ensure SeatsMap is initialized
//     await initializeSeatsMap();

//     const seatMap = await SeatMap.findOne({});
//     const rows = seatMap.rows; // Retrieve the rows from the database

//     // Check if there are enough seats available
//     while (remainingSeats > 0 && currentRow < rows.length) {
//         const lastAvailableIndex = inMemoryCache.lastAvailableIndex; // Get the last available index from in-memory cache

//         // Determine the maximum index for the current row
//         const maxIndex = (currentRow === 11) ? 3 : 7; // 3 for row 12, 7 for others

//         // Book seats starting from the last available index
//         for (let i = lastAvailableIndex; i < maxIndex && remainingSeats > 0; i++) {
//             if (rows[currentRow][i] === null) { // Check for available seat
//                 rows[currentRow][i] = username; // Assign username to the seat
//                 bookedSeats.push({ row: currentRow + 1, seat: i + 1 }); // Store booked seat info (1-based)
//                 remainingSeats--;
//                 lastAvailableIndex = i + 1
//             }
//         }

//         // Update the last available index for the current row
//         if (remainingSeats === 0) {
//             // All requested seats booked
//             inMemoryCache.lastAvailableIndex = lastAvailableIndex; // Update to last booked index
//             console.log("the last indeex current row  isssss : ",lastAvailableIndex);
//         } else {
//             // Update the last available index if there are still seats left to book
//             inMemoryCache.lastAvailableIndex = (lastAvailableIndex < maxIndex) ? lastAvailableIndex + 1 : maxIndex;
//         }

//         if (remainingSeats > 0) {
//             // Move to the next row if not all seats booked
//             currentRow++;
//             inMemoryCache.rowNumber = currentRow + 1; // Update to the next row
//             inMemoryCache.lastAvailableIndex = 0; // Reset for the next row
//         }
//     }

//     // Update the seat map in MongoDB
//     await SeatMap.findOneAndUpdate({}, { rows }, { new: true });

//     // Save the booking in UserBooked
//     if (bookedSeats.length > 0) {
//         await UserBooked.create({ username, seats: bookedSeats });
//         return res.status(200).send({
//             message: "Seats booked successfully",
//             seats: bookedSeats
//         });
//     }

//     return res.status(400).send("Not enough seats available.");
// };


const bookSeats = async (req, res) => {
    const { username, numberOfSeats } = req.body;

    // Validate the number of seats to be booked
    if (numberOfSeats < 1 || numberOfSeats > 7) {
        return res.status(400).send("You can book a maximum of 7 seats.");
    }

    let bookedSeats = [];
    let remainingSeats = numberOfSeats;
  

    // Ensure SeatsMap is initialized
    await initializeSeatsMap();

    const seatMap = await SeatMap.findOne({});
    const rows = seatMap.rows; // Retrieve the rows from the database

    // Check if there are enough seats available
    while (remainingSeats > 0 && inMemoryCache.rowNumber - 1 < rows.length) {
        currentRow = inMemoryCache.rowNumber - 1;
        let lastAvailableIndex = inMemoryCache.lastAvailableIndex;
        const maxIndex = (currentRow === 11) ? 3 : 7; // 3 for row 12, 7 for others

        
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

