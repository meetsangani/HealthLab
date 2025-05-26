const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test', // Assuming it references a Test model
    required: false // Make it optional to avoid validation errors
  },
  testName: { type: String }, // Store test name for quick access
  userName: { type: String },
  userEmail: { type: String },
  date: { type: Date, required: true },
  timeSlot: { type: String },
  collectionType: { type: String, enum: ['center', 'home'], default: 'center' },
  address: { type: String },
  notes: { type: String },
  price: { type: Number },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'sample_collected', 'report_ready'], 
    default: 'pending' 
  },
  report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
