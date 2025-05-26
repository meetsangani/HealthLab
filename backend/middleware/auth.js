const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'No Authorization header found, authentication required',
        details: 'Please include Bearer token in the Authorization header'
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ 
        message: 'No token found in Authorization header',
        details: 'Format should be: Bearer <token>'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found', 
        details: 'The user associated with this token no longer exists'
      });
    }
    
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token',
        details: 'The provided authentication token is malformed or invalid'
      });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired', 
        details: 'Your session has expired. Please log in again'
      });
    }
    
    console.error('Auth middleware error:', err);
    res.status(401).json({ 
      message: 'Authentication failed', 
      details: process.env.NODE_ENV === 'development' ? err.message : 'Please try logging in again'
    });
  }
};

module.exports = auth;
