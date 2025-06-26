const express = require('express');
const router = express.Router();
// const multer = require('multer');
const path = require('path');

const {
  addHomework,
  fetchHomeworkByClass,
  fetchHomeworkByStudent
} = require('../controllers/homeworkController');

// // File upload config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
// });
// const upload = multer({ storage });

// Routes
router.post('/', addHomework);
router.get('/class/:classId', fetchHomeworkByClass);
router.get('/student/:studentId', fetchHomeworkByStudent);

module.exports = router;
