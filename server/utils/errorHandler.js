// ✅ Centralized Error Handler Middleware

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal server error';

  // Wrong MongoDB ID error
  if (err.name === 'CastError') {
    const message = `Invalid ID: ${err.path}`;
    return res.status(400).json({
      success: false,
      msg: message
    });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map(val => val.message)
      .join(', ');
    return res.status(400).json({
      success: false,
      msg: 'Validation Error',
      errors: message
    });
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    return res.status(400).json({
      success: false,
      msg: message
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    return res.status(401).json({
      success: false,
      msg: message
    });
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token has expired';
    return res.status(401).json({
      success: false,
      msg: message
    });
  }

  // Multer file upload errors
  if (err.name === 'MulterError') {
    let message = 'File upload error';
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size exceeds 5MB limit';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files';
    }
    return res.status(400).json({
      success: false,
      msg: message
    });
  }

  // Custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      msg: err.message
    });
  }

  // Generic error - don't expose sensitive info in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  res.status(err.statusCode).json({
    success: false,
    msg: isDevelopment ? err.message : 'An error occurred. Please try again.',
    ...(isDevelopment && { stack: err.stack })
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, AppError, asyncHandler };
