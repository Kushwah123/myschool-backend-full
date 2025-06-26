const Marks = require('../models/marksModel');

// ➕ Add Marks
exports.addMarks = async (req, res) => {
  try {
    const newMarks = new Marks(req.body);
    await newMarks.save();
    res.status(201).json({ message: 'Marks added successfully', marks: newMarks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update Marks
exports.updateMarks = async (req, res) => {
  try {
    const updated = await Marks.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Marks not found' });
    res.json({ message: 'Marks updated', marks: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📄 Get Marks by Student
exports.getMarksByStudent = async (req, res) => {
  try {
    const marks = await Marks.find({ student: req.params.studentId })
      .populate('subject')
      .populate('classId');
    res.json(marks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📘 Get Marks by Class
exports.getMarksByClass = async (req, res) => {
  try {
    const marks = await Marks.find({ classId: req.params.classId })
      .populate('subject')
      .populate('student');
    res.json(marks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
