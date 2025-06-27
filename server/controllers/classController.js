const Class = require('../models/Class');
const Subject = require('../models/subjectModel');

// ➕ Create Class
exports.createClass = async (req, res) => {
  try {
    const { name, section, subjects, classTeacher } = req.body;

    // 🔍 Check for existing class with same name and section
    const existing = await Class.findOne({ name, section });
    if (existing) {
      return res.status(400).json({ error: 'Class with this name and section already exists.' });
    }

    const newClass = new Class({
      name,
      section,
      subjects,
      classTeacher
    });

    await newClass.save();
    res.status(201).json({ message: 'Class created', classData: newClass });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 📄 Get All Classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('subjects').populate('classTeacher');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
