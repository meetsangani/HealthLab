const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

// Middleware to ensure user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};

// Ensure uploads directory exists
const reportUploadDir = path.join(__dirname, '..', 'uploads', 'reports'); // Adjust path as needed
if (!fs.existsSync(reportUploadDir)) {
  fs.mkdirSync(reportUploadDir, { recursive: true });
}

// Multer configuration for PDF report uploads
const reportStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, reportUploadDir);
  },
  filename: function (req, file, cb) {
    // bookingId can be passed in request body or as a param if needed for filename
    // For simplicity, using timestamp and original name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const reportFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const uploadReport = multer({ 
  storage: reportStorage,
  fileFilter: reportFileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});

// POST /api/upload/report - Upload a PDF report
// This route will be used by admins to upload a report file.
// The file URL returned can then be used to create/update a Report document.
router.post('/report', auth, isAdmin, uploadReport.single('reportFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded or file type incorrect.' });
  }
  // Construct the URL to access the file. This depends on how you serve static files.
  // Example: if 'uploads' is served as a static folder at '/uploads'
  const fileUrl = `/uploads/reports/${req.file.filename}`; 
  res.status(201).json({ 
    message: 'Report uploaded successfully', 
    fileUrl: fileUrl, // This URL will be stored in the Report model
    fileName: req.file.filename 
  });
}, (error, req, res, next) => { // Error handling for multer
    if (error instanceof multer.MulterError) {
        return res.status(400).json({ message: `Multer error: ${error.message}` });
    } else if (error) {
        return res.status(400).json({ message: error.message });
    }
    next();
});

module.exports = router;
