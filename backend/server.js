const express = require('express');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// Import admin routes
const adminRoutes = require('./admin/routes/index');
const adminUploadRoutes = require('./admin/routes/upload');

// Admin routes (protected)
app.use('/api/admin', adminRoutes);
app.use('/api/admin/upload', adminUploadRoutes);

module.exports = app;