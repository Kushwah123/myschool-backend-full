const Exam = require('../models/examModel');

// ➕ create exam
exports.createExam = async (req, res) => {
  try {
    // only teacher or admin can create
    if (!['teacher','admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const { name, type, classId, subjectId } = req.body;
    if (!name || !type || !classId || !subjectId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const exam = await Exam.create({ ...req.body, createdBy: req.userId });
    res.status(201).json({ message: 'Exam created', exam });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📄 get exams for class
exports.getExamsByClass = async (req, res) => {
  try {
    const exams = await Exam.find({ classId: req.params.classId })
      .populate('subjectId');
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📄 get exams for subject
exports.getExamsBySubject = async (req, res) => {
  try {
    const exams = await Exam.find({ subjectId: req.params.subjectId });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ⚙️ update exam
exports.updateExam = async (req, res) => {
  try {
    const updated = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Exam not found' });
    res.json({ message: 'Exam updated', exam: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑 delete exam
exports.deleteExam = async (req, res) => {
  try {
    const del = await Exam.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: 'Exam not found' });
    res.json({ message: 'Exam deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
