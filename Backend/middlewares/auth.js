const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the token exists in the "Authorization" header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extract the token (Format: "Bearer eyJhbGciOiJIUz...")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user in the database (Exclude the password from the result)
      req.user = await User.findById(decoded.id).select('-password');

      // 5. If the user was deleted but the token is still valid, reject it
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user no longer exists.' });
      }

      // Move to the next middleware or controller
      next();
    } catch (error) {
      console.error('JWT Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed or expired.' });
    }
  }

  // 6. If no token was provided at all
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided.' });
  }
};

// ---> NEW: Admin Middleware <---
const isAdmin = (req, res, next) => {
  // Check if the user object exists (attached by 'protect') AND if their role is 'admin'
  if (req.user && req.user.role === 'admin') {
    next(); // Let them through
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

// Export both middlewares
module.exports = { protect, isAdmin };