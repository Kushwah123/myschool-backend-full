const Homework = require('../models/Homework');

// Add Homework
exports.addHomework = async (req, res) => {
  try {
    const { title, description, classId, subject, teacher, dueDate } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newHW = new Homework({ title, description, classId, subject, teacher, dueDate, fileUrl });
    await newHW.save();

    res.status(201).json({ message: 'Homework added successfully', homework: newHW });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch by class
exports.fetchHomeworkByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const homework = await Homework.find({ classId }).populate('classId').populate('teacher');
    res.json(homework);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch by student (via student.classId)
exports.fetchHomeworkByStudent = async (req, res) => {
  try {
    const { classId } = req.query;
    const homework = await Homework.find({ classId }).populate('teacher');
    res.json(homework);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
