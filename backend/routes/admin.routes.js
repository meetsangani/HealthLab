const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking.model');
const Test = require('../models/Test.model');
const User = require('../models/User.model');

// Middleware to ensure user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};

// Apply auth and isAdmin middleware to all routes in this file
router.use(auth, isAdmin);

// GET /api/admin/stats - Dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalTests = await Test.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    // More stats can be added here, e.g., pending bookings, revenue, etc.
    // Example: recent bookings
    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5).populate('customer', 'name').populate('test', 'name');

    res.json({
      totalBookings,
      totalTests,
      totalCustomers,
      recentBookingsSummary: recentBookings.map(b => ({
        id: b._id,
        customerName: b.customer ? b.customer.name : 'N/A',
        testName: b.test ? b.test.name : b.testName || 'N/A', // Fallback to testName if populated test is not available
        date: b.date,
        status: b.status
      }))
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Failed to fetch admin statistics', error: error.message });
  }
});

// --- Manage Tests ---
// GET /api/admin/tests - Get all tests
router.get('/tests', async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (error) {
    console.error('Error fetching tests for admin:', error);
    res.status(500).json({ message: 'Failed to fetch tests', error: error.message });
  }
});

// POST /api/admin/tests - Add a new test
router.post('/tests', async (req, res) => {
  try {
    const { name, price, category, description, requirements, sampleType, reportDeliveryTime } = req.body;
    // Basic validation
    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required for a test.' });
    }
    const newTest = new Test({ name, price, category, description, requirements, sampleType, reportDeliveryTime });
    await newTest.save();
    res.status(201).json(newTest);
  } catch (error) {
    console.error('Error adding new test:', error);
    res.status(500).json({ message: 'Failed to add new test', error: error.message });
  }
});

// PUT /api/admin/tests/:id - Update a test
router.put('/tests/:id', async (req, res) => {
  try {
    const updatedTest = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTest) {
      console.log(`Admin attempted to update test with ID ${req.params.id}, but it was not found`);
      return res.status(404).json({ 
        message: 'Test not found',
        details: 'The test you are trying to update does not exist or may have been deleted'
      });
    }
    res.json(updatedTest);
  } catch (error) {
    console.error('Error updating test:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid test ID format',
        details: 'The provided test ID is not in a valid format'
      });
    }
    res.status(500).json({ message: 'Failed to update test', error: error.message });
  }
});

// DELETE /api/admin/tests/:id - Delete a test
router.delete('/tests/:id', async (req, res) => {
  try {
    const deletedTest = await Test.findByIdAndDelete(req.params.id);
    if (!deletedTest) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    console.error('Error deleting test:', error);
    res.status(500).json({ message: 'Failed to delete test', error: error.message });
  }
});

// --- Manage Customers ---
// GET /api/admin/customers - Get all customers (users with role 'customer')
router.get('/customers', async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password');
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Failed to fetch customers', error: error.message });
  }
});

// PUT /api/admin/customers/:id - Update customer details (stub)
router.put('/customers/:id', async (req, res) => {
  try {
    // Add logic to update customer details
    // For now, just a placeholder
    const customer = await User.findById(req.params.id).select('-password');
    if (!customer || customer.role !== 'customer') {
        return res.status(404).json({ message: 'Customer not found' });
    }
    // Example: User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.status(501).json({ message: 'Updating customer details not yet implemented.', customer });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Failed to update customer', error: error.message });
  }
});

// --- Manage Bookings ---
// GET /api/admin/bookings - Get all bookings with optional filters
router.get('/bookings', async (req, res) => {
  try {
    const { dateFrom, dateTo, testId, status } = req.query;
    let query = {};
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }
    if (testId) query.test = testId; // Assuming testId is the ObjectId of the test
    if (status) query.status = status;

    const bookings = await Booking.find(query).populate('customer', 'name email').populate('test', 'name price');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings for admin:', error);
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
});

// PUT /api/admin/bookings/:id/status - Update booking status
router.put('/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    // Add validation for allowed statuses if necessary
    const allowedStatuses = ['pending', 'confirmed', 'sample_collected', 'processing', 'report_ready', 'completed', 'cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid or missing status.' });
    }
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true })
                                        .populate('customer', 'name email')
                                        .populate('test', 'name price');
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Failed to update booking status', error: error.message });
  }
});

// POST /api/admin/bookings/:id/report - Upload PDF report (stub)
router.post('/bookings/:id/report', async (req, res) => {
  // This is a stub. Full implementation requires file handling (e.g., multer)
  // and storage (e.g., local filesystem, cloud storage).
  // Then, update the booking record with the report URL or path.
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    // Example: booking.reportUrl = 'path/to/uploaded/report.pdf'; await booking.save();
    res.status(501).json({ message: 'Report upload functionality not yet implemented.' });
  } catch (error) {
    console.error('Error uploading report (stub):', error);
    res.status(500).json({ message: 'Failed to upload report (stub)', error: error.message });
  }
});

// GET /api/admin/bookings/export - Export booking data (stub for CSV/Excel)
router.get('/bookings/export', async (req, res) => {
  // This is a stub. Full implementation requires generating CSV/Excel data.
  // Libraries like 'json2csv' or 'exceljs' can be used.
  try {
    // const bookings = await Booking.find().lean(); // Fetch data
    // const csvData = convertToCsv(bookings); // Convert to CSV
    // res.header('Content-Type', 'text/csv');
    // res.attachment('bookings.csv');
    // res.send(csvData);
    res.status(501).json({ message: 'Booking data export functionality not yet implemented.' });
  } catch (error) {
    console.error('Error exporting bookings (stub):', error);
    res.status(500).json({ message: 'Failed to export bookings (stub)', error: error.message });
  }
});

module.exports = router;
