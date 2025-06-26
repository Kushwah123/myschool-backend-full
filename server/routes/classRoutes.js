const express = require('express');
const router = express.Router();
const { createClass, getAllClasses } = require('../controllers/classController');
// const protect = require('../middlewares/authMiddleware');
const protect = require('../middlewares/authMiddleware');

// Create new class
router.post('/',  createClass);

// Get all classes
router.get('/',  getAllClasses);

module.exports = router;
