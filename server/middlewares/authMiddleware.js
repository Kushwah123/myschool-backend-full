const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { AppError } = require("../utils/errorHandler");

// ✅ Protected Route Middleware
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        msg: "No token provided. Authorization denied" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        msg: "User not found" 
      });
    }

    req.user = user;
    req.userId = decoded.id;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        msg: "Token has expired" 
      });
    }
    return res.status(401).json({ 
      success: false,
      msg: "Invalid token" 
    });
  }
};

// ✅ Role-based Authorization
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        msg: "User not authenticated" 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        msg: `Access denied. Required roles: ${allowedRoles.join(', ')}` 
      });
    }

    next();
  };
};

const adminOnly = authorize('admin');
const teacherOnly = authorize('teacher');
const studentOnly = authorize('student');
const parentOnly = authorize('parent');
const accountantOnly = authorize('accountant');

module.exports = { 
  protect, 
  authorize, 
  adminOnly, 
  teacherOnly, 
  studentOnly, 
  parentOnly, 
  accountantOnly 
};