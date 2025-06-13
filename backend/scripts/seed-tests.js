// Usage: node backend/scripts/seed-tests.js

const mongoose = require('mongoose');
const Test = require('../models/Test.model');
require('dotenv').config();

const tests = [
  {
    name: "Complete Blood Count (CBC)",
    description: "Measures red and white blood cells, hemoglobin, hematocrit, and platelets to assess overall health.",
    price: 500,
    category: "blood",
    sampleType: "Blood",
    duration: "24 hours",
    turnaround: "24 hours",
    instructions: "No special preparation required. You can eat and drink normally before this test.",
    popular: true
  },
  {
    name: "Lipid Profile",
    description: "Measures cholesterol and triglyceride levels to assess cardiovascular risk.",
    price: 800,
    category: "blood", 
    sampleType: "Blood",
    duration: "24 hours",
    turnaround: "24 hours",
    instructions: "Fasting for 9-12 hours is recommended. Only water is allowed during fasting period.",
    popular: true
  },
  {
    name: "Liver Function Test (LFT)",
    description: "Assesses the health of your liver by measuring various enzymes and proteins.",
    price: 1200,
    category: "liver",
    sampleType: "Blood",
    duration: "24 hours",
    turnaround: "24 hours",
    instructions: "No special preparation required.",
    popular: false
  },
  {
    name: "Thyroid Profile (T3, T4, TSH)",
    description: "Evaluates thyroid gland function to detect thyroid disorders.",
    price: 1500,
    category: "thyroid",
    sampleType: "Blood",
    duration: "48 hours", 
    turnaround: "48 hours",
    instructions: "No special preparation required. Take medications as usual.",
    popular: true
  },
  {
    name: "Comprehensive Urinalysis",
    description: "Detects disorders of the kidney and urinary tract through urine examination.",
    price: 400,
    category: "urine",
    sampleType: "Urine",
    duration: "24 hours",
    turnaround: "24 hours",
    instructions: "Collect midstream urine sample in the sterile container provided.",
    popular: false
  },
  {
    name: "Full Body Health Checkup",
    description: "A comprehensive health checkup package including multiple tests for overall health assessment.",
    price: 5000,
    category: "full-body",
    sampleType: "Blood, Urine",
    duration: "72 hours",
    turnaround: "72 hours", 
    instructions: "Fasting for 10-12 hours is recommended. Bring all current medications list.",
    popular: true
  },
  {
    name: "COVID-19 RT-PCR Test",
    description: "Detects SARS-CoV-2 virus using molecular testing method.",
    price: 1800,
    category: "covid",
    sampleType: "Nasal/Throat Swab",
    duration: "24 hours",
    turnaround: "24 hours",
    instructions: "No special preparation required. Avoid eating, drinking, or brushing teeth 30 minutes before test.",
    popular: false
  },
  {
    name: "Food Allergy Panel",
    description: "Detects common food allergies including nuts, dairy, eggs, and more.",
    price: 3500,
    category: "allergy",
    sampleType: "Blood",
    duration: "72 hours",
    turnaround: "72 hours",
    instructions: "No special preparation required. Continue normal diet.",
    popular: false
  },
  {
    name: "Vitamin D Test",
    description: "Measures Vitamin D levels in the blood to assess bone health.",
    price: 1200,
    category: "blood",
    sampleType: "Blood", 
    duration: "48 hours",
    turnaround: "48 hours",
    instructions: "No special preparation required.",
    popular: true
  },
  {
    name: "Diabetes Profile (HbA1c + Glucose)",
    description: "Comprehensive diabetes monitoring including blood sugar and long-term glucose control.",
    price: 900,
    category: "diabetes",
    sampleType: "Blood",
    duration: "24 hours", 
    turnaround: "24 hours",
    instructions: "Fasting for 8-10 hours required for accurate glucose measurement.",
    popular: true
  },
  {
    name: "Kidney Function Test",
    description: "Evaluates kidney health through creatinine, urea, and other markers.",
    price: 800,
    category: "kidney",
    sampleType: "Blood", 
    duration: "24 hours",
    turnaround: "24 hours",
    instructions: "No special preparation required.",
    popular: false
  },
  {
    name: "Cardiac Risk Assessment",
    description: "Comprehensive heart health evaluation including lipids, enzymes, and biomarkers.",
    price: 2500,
    category: "cardiac",
    sampleType: "Blood",
    duration: "48 hours",
    turnaround: "48 hours", 
    instructions: "Fasting for 12 hours recommended. Avoid strenuous exercise 24 hours before test.",
    popular: true
  }
];

async function seedTests() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/healthlab';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB successfully');
    
    // Clear existing tests
    await Test.deleteMany({});
    console.log('Cleared existing tests');
    
    // Insert new tests
    const insertedTests = await Test.insertMany(tests);
    console.log(`✅ Successfully seeded ${insertedTests.length} tests to MongoDB!`);
    
    // Display inserted tests
    console.log('\nInserted tests:');
    insertedTests.forEach((test, index) => {
      console.log(`${index + 1}. ${test.name} - ₹${test.price} (${test.category})`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding tests:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the seed function
seedTests();
