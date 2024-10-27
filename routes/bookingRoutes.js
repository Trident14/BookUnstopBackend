const express = require('express');
const { bookSeats } = require('../controllers/bookingController'); 

const router = express.Router();

router.post('/book', bookSeats); 

module.exports = router;
