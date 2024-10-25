const UserBooked = require('../models/UserBooked');
const SeatsMap = require('../models/SeatsMap');
const { inMemoryCache } = require('./cacheController');

// Function to book seats
const bookSeats = async (req, res) => {
    const { username, numberOfSeats } = req.body;

    if (numberOfSeats < 1 || numberOfSeats > 7) {
        return res.status(400).send("You can book a maximum of 7 seats.");
    }

    let bookedSeats = [];
    let remainingSeats = numberOfSeats;
    let currentRow = inMemoryCache.rowNumber; // Current row with available seats
    let availableSeats = inMemoryCache.availableSeats; // Available seats in the current row

    // Check if the current row has enough seats
    while (remainingSeats > 0) {
        if (availableSeats >= remainingSeats) {
            // Book the required seats in the current row
            let startSeat = 7 - availableSeats + 1; // Seat numbering starts after filled seats
            bookedSeats.push(
                ...Array.from({ length: remainingSeats }, (_, i) => ({
                    row: currentRow,
                    seat: startSeat + i
                }))
            );
            availableSeats -= remainingSeats;
            remainingSeats = 0; // All seats are booked

            // Update the SeatsMap in MongoDB for the current row
            await SeatsMap.findOneAndUpdate(
                { row: currentRow },
                { $inc: { availableSeats: -numberOfSeats } }, // Reduce available seats
                { new: true }
            );
        } else {
            // Book the available seats and move to the next row
            let startSeat = 7 - availableSeats + 1;
            bookedSeats.push(
                ...Array.from({ length: availableSeats }, (_, i) => ({
                    row: currentRow,
                    seat: startSeat + i
                }))
            );
            remainingSeats -= availableSeats;

            // Update the SeatsMap in MongoDB for the current row
            await SeatsMap.findOneAndUpdate(
                { row: currentRow },
                { $set: { availableSeats: 0 } }, // No seats available in this row anymore
                { new: true }
            );

            // Move to the next row
            currentRow++;
            availableSeats = (currentRow === 12) ? 3 : 7; // Last row has only 3 seats
        }

        // Update inMemoryCache with the new row and seat availability
        inMemoryCache.rowNumber = currentRow;
        inMemoryCache.availableSeats = availableSeats;
    }

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

// Export the bookSeats function
module.exports = { bookSeats };
