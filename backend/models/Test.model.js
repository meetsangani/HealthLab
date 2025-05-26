const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  price: { type: Number, required: true },
  sampleType: String,
  duration: String,
  instructions: String,
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
