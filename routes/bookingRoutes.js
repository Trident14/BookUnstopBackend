const express = require('express');
const { bookSeats } = require('../controllers/bookingController'); // Ensure this import is correct

const router = express.Router();

// Define the POST route for booking seats
router.post('/book', bookSeats); // Ensure bookSeats is correctly referenced here

module.exports = router;
