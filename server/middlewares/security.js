// ✅ Rate Limiting aur Security Middleware

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// General Rate Limiter - 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  store: new (require('rate-limit-store'))(), // Use memory store
  skip: (req) => {
    // Skip rate limiting for GET requests to home
    return req.method === 'GET' && req.path === '/';
  }
});

// Strict Rate Limiter for Login - 5 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts
  message: 'Too many login attempts. Please try again after 15 minutes.',
  skipSuccessfulRequests: true // Don't count successful requests
});

// Strict Rate Limiter for Signup - 3 per hour
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: 'Too many accounts created from this IP. Please try again after an hour.'
});

// API Rate Limiter - 1000 requests per hour
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000,
  message: 'Too many API requests. Please try again later.'
});

// Security Headers with Helmet
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'data:']
    }
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  }
});

// CORS Configuration
const corsConfig = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = {
  generalLimiter,
  loginLimiter,
  signupLimiter,
  apiLimiter,
  securityHeaders,
  corsConfig
};
