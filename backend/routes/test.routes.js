const express = require('express');
const router = express.Router();
const Test = require('../models/Test.model');
const auth = require('../middleware/auth');

// Get all tests
router.get('/', async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (err) {
    console.error('Error fetching tests:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get test by id
router.get('/:id', async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch (err) {
    console.error('Error fetching test:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create test (admin)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const test = await Test.create(req.body);
    res.status(201).json(test);
  } catch (err) {
    console.error('Error creating test:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update test (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch (err) {
    console.error('Error updating test:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete test (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const result = await Test.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Test not found' });
    res.json({ message: 'Test deleted' });
  } catch (err) {
    console.error('Error deleting test:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
