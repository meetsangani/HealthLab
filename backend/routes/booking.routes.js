const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking.model');
const auth = require('../middleware/auth');

// Get all bookings (admin) or own bookings (customer)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const bookings = await Booking.find().populate('customer test report');
      res.json(bookings);
    } else {
      // Ensure users can only see their own bookings
      const bookings = await Booking.find({ customer: req.user._id }).populate('test report');
      res.json(bookings);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
});

// Create booking (customer)
router.post('/', auth, async (req, res) => {
  try {
    const { test, date } = req.body;
    // Always set the customer to the current logged-in user
    const booking = await Booking.create({ customer: req.user._id, test, date });
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: 'Error creating booking', error: err.message });
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
