const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');

// ✅ POST /api/teachers
exports.registerTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await Teacher.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Teacher already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = new Teacher({ ...req.body, password: hashedPassword });

    await teacher.save();
    res.status(201).json({ message: 'Teacher registered successfully', teacher });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ GET /api/teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().select('-password');
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch teachers' });
  }
};
