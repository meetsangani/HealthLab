const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

// In-memory store for OTPs (for production, use Redis or DB)
const otpStore = {};

// Helper to send OTP email
async function sendOtpEmail(email, otp) {
  // In development mode, just log the OTP
  if (process.env.NODE_ENV === 'development') {
    console.log(`Development OTP for ${email}: ${otp}`);
    return Promise.resolve();
  }

  // Check if email credentials are configured
  if (!process.env.OTP_EMAIL_USER || !process.env.OTP_EMAIL_PASS) {
    throw new Error('Email service not configured. Please set OTP_EMAIL_USER and OTP_EMAIL_PASS environment variables.');
  }

  // Configure transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.OTP_EMAIL_USER,
      pass: process.env.OTP_EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Send email
  await transporter.sendMail({
    from: process.env.OTP_EMAIL_USER,
    to: email,
    subject: 'Your Registration OTP',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Registration OTP</h2>
        <p>Your OTP for registration is:</p>
        <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
    text: `Your OTP for registration is: ${otp}. This OTP will expire in 10 minutes.`,
  });
}

// Registration Step 1: Send OTP
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    // Debug log
    console.log("Register request body:", req.body);

    // Validate all required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required (name, email, password, phone)' });
    }
    
    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Only allow Gmail addresses
    if (!/@gmail\.com$/i.test(email)) {
      return res.status(400).json({ message: 'Only Gmail addresses are allowed for registration' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with user data
    otpStore[email] = {
      otp,
      data: { name, email, password, phone },
      expires: Date.now() + 10 * 60 * 1000 // 10 min expiry
    };
    
    try {
      // Send OTP email
      await sendOtpEmail(email, otp);
      console.log(`OTP sent to ${email}: ${otp}`); // For debugging
      
      res.status(200).json({ 
        message: 'OTP sent to your Gmail. Please verify to complete registration.',
        email: email,
        ...(process.env.NODE_ENV === 'development' && { otp }) // Include OTP in response for development
      });
    } catch (err) {
      console.error('Error sending OTP email:', err);
      
      // In development mode, still allow registration to proceed
      if (process.env.NODE_ENV === 'development') {
        console.log(`Development mode - OTP for ${email}: ${otp}`);
        return res.status(200).json({ 
          message: 'Development mode: OTP sent (check console). Please verify to complete registration.',
          email: email,
          otp: otp // Include OTP in response for development testing
        });
      }
      
      // Clean up OTP store on email failure
      delete otpStore[email];
      
      return res.status(500).json({ 
        message: 'Failed to send OTP email. Please check your email address or try again later.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      message: 'Registration failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Registration Step 2: Verify OTP and create user
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
    
    const entry = otpStore[email];
    
    if (!entry) {
      return res.status(400).json({ message: 'No OTP request found for this email' });
    }
    
    if (entry.expires < Date.now()) {
      delete otpStore[email];
      return res.status(400).json({ message: 'OTP expired. Please request a new one' });
    }
    
    if (entry.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again' });
    }

    // Create user
    const { name, password, phone } = entry.data;
    
    try {
      const user = await User.create({ 
        name, 
        email, 
        password, 
        phone 
      });
      
      // Clean up OTP store
      delete otpStore[email];
      
      res.status(201).json({ 
        message: 'Registration successful! You can now log in.', 
        user: { 
          id: user._id, 
          name, 
          email, 
          phone 
        } 
      });
    } catch (err) {
      console.error('User creation error:', err);
      return res.status(400).json({ 
        message: 'Failed to create user account. Please try again.' 
      });
    }
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ 
      message: 'Verification failed. Please try again.'
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    
    // Debug log
    console.log("Login attempt with:", { emailOrPhone, passwordProvided: !!password });
    
    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: 'Email/phone and password are required' });
    }

    // Normalize the input by trimming and converting to string
    const normalizedInput = emailOrPhone.toString().trim();
    const isEmail = normalizedInput.includes('@');
    
    // Find user by email or phone with flexible matching for phone numbers
    let user;
    if (isEmail) {
      // Find by email (case insensitive)
      user = await User.findOne({ email: new RegExp(`^${normalizedInput}$`, 'i') }).select('+password');
      console.log("Looking up by email:", normalizedInput);
    } else {
      // For phone number lookup, strip all non-digit characters
      const phoneQuery = normalizedInput.replace(/\D/g, '');
      const lastTenDigits = phoneQuery.slice(-10); // Get last 10 digits for India numbers
      
      console.log("Looking up by phone:", { 
        original: normalizedInput,
        normalized: phoneQuery,
        lastTenDigits 
      });
      
      // Try multiple phone formats to increase chances of finding the user
      user = await User.findOne({
        $or: [
          { phone: phoneQuery },
          { phone: new RegExp(`${phoneQuery}$`) },
          { phone: lastTenDigits },
          { phone: new RegExp(`${lastTenDigits}$`) },
          // Also try with common prefixes for Indian numbers
          { phone: `+91${lastTenDigits}` },
          { phone: `91${lastTenDigits}` }
        ]
      }).select('+password');
    }
    
    if (!user) {
      console.log("User not found for:", emailOrPhone);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Password mismatch for user:", user.email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
      
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    
    // Ensure we're sending a proper JSON response
    return res.status(200).json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone,
        role: user.role 
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// Profile
router.get('/profile', auth, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
