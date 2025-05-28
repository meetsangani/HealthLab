const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking.model');
const auth = require('../middleware/auth');
const { Parser } = require('json2csv');

// Get all bookings (admin) or own bookings (customer)
router.get('/', auth, async (req, res) => {
  try {
    let bookings;
    let query = {};

    if (req.user.role === 'admin') {
      // Admin can see all bookings and apply filters
      const { dateFrom, dateTo, testId, status, customerId } = req.query;
      if (dateFrom || dateTo) {
        query.date = {};
        if (dateFrom) query.date.$gte = new Date(dateFrom);
        if (dateTo) query.date.$lte = new Date(dateTo);
      }
      if (testId) query.test = testId;
      if (status) query.status = status;
      if (customerId) query.customer = customerId;
      
      bookings = await Booking.find(query).populate('customer test report');
    } else {
      // Customer can only see their own bookings
      query.customer = req.user._id;
      bookings = await Booking.find(query).populate('test report');
    }
    
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
});

// Get user's own bookings - specific endpoint
router.get('/user', auth, async (req, res) => {
  try {
    // Customer can only see their own bookings
    const query = { customer: req.user._id };
    const bookings = await Booking.find(query).populate('test report');
    
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching user bookings:', err);
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
        const mongoose = require('mongoose');
        if (mongoose.Types.ObjectId.isValid(req.body.test)) {
          req.body.test = new mongoose.Types.ObjectId(req.body.test);
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
    
    // Populate the created booking before sending response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('test')
      .populate('customer', 'name email');
    
    res.status(201).json(populatedBooking);
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
      console.log(`Booking with ID ${req.params.id} not found`);
      return res.status(404).json({ 
        message: 'Booking not found',
        details: 'The requested booking could not be found in our database'
      });
    }
    
    // Check if the booking belongs to the logged in user or user is admin
    if (booking.customer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied to this booking',
        details: 'You do not have permission to view this booking'
      });
    }
    
    res.json(booking);
  } catch (err) {
    console.error('Error fetching booking:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid booking ID format',
        details: 'The provided booking ID is not in a valid format'
      });
    }
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

// Export bookings (admin)
router.get('/export', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const { dateFrom, dateTo, testId, status, customerId } = req.query;
    let query = {};
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }
    if (testId) query.test = testId; // Assuming testId is the ObjectId of the test
    if (status) query.status = status;
    if (customerId) query.customer = customerId;

    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone')
      .populate('test', 'name price')
      .populate('report', 'fileUrl remarks')
      .lean(); // Use .lean() for faster queries when not needing Mongoose documents

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for the given criteria.' });
    }

    const fields = [
      { label: 'Booking ID', value: '_id' },
      { label: 'Customer Name', value: 'customer.name' },
      { label: 'Customer Email', value: 'customer.email' },
      { label: 'Customer Phone', value: 'customer.phone' },
      { label: 'Test Name', value: 'test.name' },
      { label: 'Test Price', value: 'test.price' },
      { label: 'Booking Date', value: row => new Date(row.date).toLocaleDateString() },
      { label: 'Time Slot', value: 'timeSlot' },
      { label: 'Collection Type', value: 'collectionType' },
      { label: 'Address (Home Collection)', value: 'address' },
      { label: 'Price', value: 'price' },
      { label: 'Status', value: 'status' },
      { label: 'Report URL', value: 'report.fileUrl' },
      { label: 'Report Remarks', value: 'report.remarks' },
      { label: 'Created At', value: row => new Date(row.createdAt).toLocaleString() },
    ];
    
    const json2csvParser = new Parser({ fields, unwind: ['customer', 'test', 'report'] });
    const csv = json2csvParser.parse(bookings);

    res.header('Content-Type', 'text/csv');
    res.attachment('bookings.csv');
    res.send(csv);

  } catch (err) {
    console.error('Error exporting bookings:', err);
    res.status(500).json({ message: 'Error exporting bookings', error: err.message });
  }
});

module.exports = router;
