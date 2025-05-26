const connectDB = require('../config/db');
const mongoose = require('mongoose');

// Import all models
const User = require('../models/User.model');
const Test = require('../models/Test.model');
const Booking = require('../models/Booking.model');
const Report = require('../models/Report.model');

const initializeDB = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');

    // List all collections that should exist
    const collections = [
      { model: User, name: 'users' },
      { model: Test, name: 'tests' },
      { model: Booking, name: 'bookings' },
      { model: Report, name: 'reports' }
    ];

    // Verify all collections exist
    for (const collection of collections) {
      // This will create the collection if it doesn't exist
      console.log(`Ensuring collection exists: ${collection.name}`);
      await mongoose.connection.db.createCollection(collection.name).catch(err => {
        // Collection may already exist, which is fine
        if (err.code !== 48) { // 48 is the error code for "collection already exists"
          console.error(`Error creating collection ${collection.name}:`, err);
        } else {
          console.log(`Collection ${collection.name} already exists`);
        }
      });
    }

    console.log('All collections initialized successfully');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

// Run the initialization
initializeDB();
