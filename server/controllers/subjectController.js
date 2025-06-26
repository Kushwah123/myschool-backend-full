const Subject = require('../models/subjectModel');

// ➕ Create Subject
exports.createSubject = async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json({ message: 'Subject created successfully', subject });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📄 Get All Subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate('assignedTeacher').populate('classId');
    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Get Subject by ID
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('assignedTeacher').populate('classId');
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.status(200).json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update Subject
exports.updateSubject = async (req, res) => {
  try {
    const updated = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'Subject updated successfully', updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Delete Subject
exports.deleteSubject = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
