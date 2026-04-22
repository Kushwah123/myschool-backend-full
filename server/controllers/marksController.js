const mongoose = require('mongoose');
const Marks = require('../models/marksModel');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Subject = require('../models/subjectModel');
const Chapter = require('../models/Chapter');

const findTeacherProfile = async (user) => {
  let teacher = null;
  if (user.email) {
    teacher = await Teacher.findOne({ email: user.email });
  }
  if (!teacher && user.mobile) {
    teacher = await Teacher.findOne({ mobile: user.mobile });
  }
  return teacher;
};

const teacherHasAccess = (teacher, classId, subjectId) => {
  const classIds = (teacher.assignedClasses || []).map((id) => id.toString());
  const subjectIds = (teacher.subjects || []).map((id) => id.toString());
  return classIds.includes(classId.toString()) && subjectIds.includes(subjectId.toString());
};

// ➕ Add Marks (teachers only)
exports.addMarks = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can add marks' });
    }

    const teacher = await findTeacherProfile(req.user);
    if (!teacher) {
      return res.status(403).json({ message: 'Teacher profile not found' });
    }

    const { studentId, classId, subjectId, chapterId, marksObtained, totalMarks } = req.body;
    if (!studentId || !classId || !subjectId || !chapterId || marksObtained == null || totalMarks == null) {
      return res.status(400).json({ message: 'studentId, classId, subjectId, chapterId, marksObtained, and totalMarks are required' });
    }

    if (!teacherHasAccess(teacher, classId, subjectId)) {
      return res.status(403).json({ message: 'Not authorized for this class or subject' });
    }

    const [student, subject, chapter] = await Promise.all([
      Student.findById(studentId),
      Subject.findById(subjectId),
      Chapter.findById(chapterId)
    ]);

    if (!student) return res.status(404).json({ message: 'Student not found' });
    if (student.classId.toString() !== classId.toString()) {
      return res.status(400).json({ message: 'Student does not belong to this class' });
    }

    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    if (subject.classId.toString() !== classId.toString()) {
      return res.status(400).json({ message: 'Subject does not belong to this class' });
    }

    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
    if (chapter.subjectId.toString() !== subjectId.toString()) {
      return res.status(400).json({ message: 'Chapter does not belong to this subject' });
    }

    const existing = await Marks.findOne({ studentId, chapterId });
    if (existing) {
      return res.status(400).json({ message: 'Marks already exist for this student and chapter' });
    }

    const newMarks = new Marks({ studentId, classId, subjectId, chapterId, marksObtained, totalMarks });
    await newMarks.save();
    res.status(201).json({ message: 'Marks added successfully', marks: newMarks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update Marks (teachers only)
exports.updateMarks = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can update marks' });
    }

    const teacher = await findTeacherProfile(req.user);
    if (!teacher) {
      return res.status(403).json({ message: 'Teacher profile not found' });
    }

    const { id, marksObtained, totalMarks } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'Marks id is required' });
    }

    const existing = await Marks.findById(id);
    if (!existing) return res.status(404).json({ message: 'Marks not found' });

    if (!teacherHasAccess(teacher, existing.classId, existing.subjectId)) {
      return res.status(403).json({ message: 'Not authorized for this class or subject' });
    }

    if (marksObtained == null && totalMarks == null) {
      return res.status(400).json({ message: 'marksObtained or totalMarks must be provided' });
    }

    if (marksObtained != null) existing.marksObtained = marksObtained;
    if (totalMarks != null) existing.totalMarks = totalMarks;
    await existing.save();

    return res.json({ message: 'Marks updated', marks: existing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📄 Get Marks by Student (for reportcard)
exports.getMarksByStudent = async (req, res) => {
  try {
    const marks = await Marks.find({ studentId: req.params.studentId })
      .populate('subjectId')
      .populate('classId')
      .populate('exam')
      .populate('chapterId');
    res.json(marks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📒 Get Student Report
exports.getStudentReport = async (req, res) => {
  try {
    const marks = await Marks.find({ studentId: req.params.studentId })
      .populate('subjectId')
      .populate('chapterId');

    if (!marks.length) {
      return res.status(404).json({ message: 'No marks found for this student' });
    }

    const subjectGroups = {};
    let overallObtained = 0;
    let overallTotal = 0;

    marks.forEach((mark) => {
      const subjectId = mark.subjectId?._id?.toString();
      const subjectName = mark.subjectId?.name || 'Unknown Subject';
      if (!subjectGroups[subjectId]) {
        subjectGroups[subjectId] = {
          subjectId,
          subjectName,
          chapters: [],
          subjectTotalObtained: 0,
          subjectTotalMarks: 0
        };
      }

      const chapterName = mark.chapterId?.name || 'Unknown Chapter';
      subjectGroups[subjectId].chapters.push({
        chapterId: mark.chapterId?._id,
        chapterName,
        maxMarks: mark.chapterId?.maxMarks,
        marksObtained: mark.marksObtained,
        totalMarks: mark.totalMarks,
        percentage: mark.percentage,
        grade: mark.grade
      });

      subjectGroups[subjectId].subjectTotalObtained += mark.marksObtained;
      subjectGroups[subjectId].subjectTotalMarks += mark.totalMarks;
      overallObtained += mark.marksObtained;
      overallTotal += mark.totalMarks;
    });

    const subjects = Object.values(subjectGroups).map((group) => ({
      ...group,
      subjectPercentage: group.subjectTotalMarks > 0 ? Number(((group.subjectTotalObtained / group.subjectTotalMarks) * 100).toFixed(2)) : 0
    }));

    const report = {
      studentId: req.params.studentId,
      overallTotalObtained: overallObtained,
      overallTotalMarks: overallTotal,
      overallPercentage: overallTotal > 0 ? Number(((overallObtained / overallTotal) * 100).toFixed(2)) : 0,
      subjects
    };

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📘 Get Marks by Class (analytics)
exports.getMarksByClass = async (req, res) => {
  try {
    const marks = await Marks.find({ classId: req.params.classId })
      .populate('subjectId')
      .populate('studentId')
      .populate('chapterId');
    res.json(marks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 Analytics: average percentage by subject for a class
exports.getAnalyticsByClass = async (req, res) => {
  try {
    const classId = req.params.classId;
    const agg = await Marks.aggregate([
      { $match: { classId: mongoose.Types.ObjectId(classId) } },
      { $group: { _id: '$subject', avgPercent: { $avg: '$percentage' } } },
      { $lookup: { from: 'subjects', localField: '_id', foreignField: '_id', as: 'subject' } },
      { $unwind: '$subject' }
    ]);
    res.json(agg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

