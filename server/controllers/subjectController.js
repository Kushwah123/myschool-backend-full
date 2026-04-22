const Subject = require('../models/subjectModel');
const Class = require('../models/Class');

// ➕ Create Subject
exports.createSubject = async (req, res) => {
  try {
    const { name, classId, code, assignedTeacher } = req.body;

    if (!name || !classId) {
      return res.status(400).json({ error: 'name and classId are required' });
    }

    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ error: 'Class not found' });
    }

    let normalizedCode = code?.trim();
    if (!normalizedCode) {
      normalizedCode = name.match(/\b\w/g)?.join('').toUpperCase().slice(0, 4) || name.toUpperCase().slice(0, 4);
    }

    const existingCode = await Subject.findOne({ code: normalizedCode });
    if (existingCode) {
      normalizedCode = `${normalizedCode}-${Date.now().toString().slice(-4)}`;
    }

    const subject = new Subject({ name, classId, code: normalizedCode, assignedTeacher });
    await subject.save();

    if (!classObj.subjects) classObj.subjects = [];
    if (!classObj.subjects.includes(subject._id)) {
      classObj.subjects.push(subject._id);
      await classObj.save();
    }

    res.status(201).json({ message: 'Subject created successfully', subject });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➕ Add Subject (admin)
exports.addSubject = async (req, res) => {
  try {
    const { name, classId, code, assignedTeacher } = req.body;

    if (!name || !classId) {
      return res.status(400).json({ error: 'name and classId are required' });
    }

    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ error: 'Class not found' });
    }

    let normalizedCode = code?.trim();
    if (!normalizedCode) {
      normalizedCode = name.match(/\b\w/g)?.join('').toUpperCase().slice(0, 4) || name.toUpperCase().slice(0, 4);
    }

    const existingCode = await Subject.findOne({ code: normalizedCode });
    if (existingCode) {
      normalizedCode = `${normalizedCode}-${Date.now().toString().slice(-4)}`;
    }

    const subject = new Subject({ name, classId, code: normalizedCode, assignedTeacher });
    await subject.save();

    if (!classObj.subjects) classObj.subjects = [];
    if (!classObj.subjects.includes(subject._id)) {
      classObj.subjects.push(subject._id);
      await classObj.save();
    }

    return res.status(201).json({ message: 'Subject created successfully', subject });
  } catch (err) {
    return res.status(500).json({ error: err.message });
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
