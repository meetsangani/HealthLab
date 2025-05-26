const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking.model');
const auth = require('../middleware/auth');

// Get all bookings (admin) or own bookings (customer)
router.get('/', auth, async (req, res) => {
  try {
    let bookings;
    
    if (req.user.role === 'admin') {
      // Admin can see all bookings
      bookings = await Booking.find().populate('customer test report');
    } else {
      // Customer can only see their own bookings
      bookings = await Booking.find({ 
        customer: req.user._id 
      }).populate('test report');
    }
    
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
});

// Create booking (customer)
router.post('/', auth, async (req, res) => {
  try {
    // Set the customer field to the authenticated user's ID
    req.body.customer = req.user._id;
    
    // Validate and convert the test field if it exists
    if (req.body.test) {
      try {
        // If it's not a valid ObjectId, we'll either:
        // 1. Convert it to a valid ObjectId if it's a valid ID format
        // 2. Remove it if it's not needed or not in proper format
        const mongoose = require('mongoose');
        if (mongoose.Types.ObjectId.isValid(req.body.test)) {
          req.body.test = mongoose.Types.ObjectId(req.body.test);
        } else {
          // If not a valid ObjectId format, remove it or set to null
          delete req.body.test;
        }
      } catch (error) {
        // If conversion fails, remove the field
        delete req.body.test;
      }
    }

    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get booking by ID - secure it to only allow access to own bookings
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('test report');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if the booking belongs to the logged in user or user is admin
    if (booking.customer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied to this booking' });
    }
    
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching booking', error: err.message });
  }
});

// Update booking status (admin)
router.put('/:id/status', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(booking);
});

// Delete booking (admin)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ message: 'Booking deleted' });
});

module.exports = router;
