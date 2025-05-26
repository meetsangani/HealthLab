const express = require('express');
const router = express.Router();
const Report = require('../models/Report.model');
const Booking = require('../models/Booking.model');
const auth = require('../middleware/auth');

// Get all reports (admin) or own reports (customer)
router.get('/', auth, async (req, res) => {
  if (req.user.role === 'admin') {
    const reports = await Report.find().populate('booking');
    res.json(reports);
  } else {
    // Find bookings for this user
    const bookings = await Booking.find({ customer: req.user._id });
    const bookingIds = bookings.map(b => b._id);
    const reports = await Report.find({ booking: { $in: bookingIds } });
    res.json(reports);
  }
});

// Create report (admin)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const { booking, fileUrl, remarks } = req.body;
  const report = await Report.create({ booking, fileUrl, remarks });
  // Link report to booking
  await Booking.findByIdAndUpdate(booking, { report: report._id });
  res.status(201).json(report);
});

// Delete report (admin)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  await Report.findByIdAndDelete(req.params.id);
  res.json({ message: 'Report deleted' });
});

module.exports = router;
