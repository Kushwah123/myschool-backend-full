const Class = require('../models/Class');
const Subject = require('../models/subjectModel');
const Teacher = require('../models/Teacher');

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

// 🧑‍🏫 Assign Class Teacher
exports.assignClassTeacher = async (req, res) => {
  try {
    const { classId, teacherId } = req.body;

    if (!classId || !teacherId) {
      return res.status(400).json({ error: 'classId and teacherId are required' });
    }

    const existingClass = await Class.findById(classId);
    if (!existingClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    existingClass.classTeacher = teacherId;
    await existingClass.save();

    if (!teacher.assignedClasses) {
      teacher.assignedClasses = [];
    }
    if (!teacher.assignedClasses.includes(classId)) {
      teacher.assignedClasses.push(classId);
      await teacher.save();
    }

    return res.status(200).json({ message: 'Class teacher assigned successfully', class: existingClass, teacher });
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
