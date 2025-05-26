const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  price: { type: Number, required: true },
  sampleType: String,
  duration: String, // e.g., "24 hours"
  instructions: String,
  turnaround: String, // e.g., "24 hours"
  category: String, // e.g., "blood", "urine", etc.
  popular: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
