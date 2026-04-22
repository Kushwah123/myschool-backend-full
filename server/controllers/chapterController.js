const Chapter = require('../models/Chapter');
const Subject = require('../models/subjectModel');
const Teacher = require('../models/Teacher');
const TeacherSubject = require('../models/TeacherSubject');

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

// ➕ Add Chapter
exports.addChapter = async (req, res) => {
  try {
    const { name, subjectId, maxMarks } = req.body;

    if (!name || !subjectId || maxMarks == null) {
      return res.status(400).json({ error: 'name, subjectId, and maxMarks are required' });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const existing = await Chapter.findOne({ name: name.trim(), subjectId });
    if (existing) {
      return res.status(400).json({ error: 'Chapter with this name already exists for the subject' });
    }

    const chapter = new Chapter({ name: name.trim(), subjectId, maxMarks });
    await chapter.save();

    return res.status(201).json({ message: 'Chapter created successfully', chapter });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 📄 Get chapters by subject for teacher
exports.getChaptersBySubject = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can access this endpoint' });
    }

    const teacher = await findTeacherProfile(req.user);
    if (!teacher) {
      return res.status(403).json({ message: 'Teacher profile not found' });
    }

    const { subjectId } = req.params;
    if (!subjectId) {
      return res.status(400).json({ message: 'subjectId is required' });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const assignedClasses = (teacher.assignedClasses || []).map((id) => id.toString());
    const assignedSubjects = (teacher.subjects || []).map((id) => id.toString());

    if (!assignedSubjects.includes(subjectId.toString()) || !assignedClasses.includes(subject.classId.toString())) {
      return res.status(403).json({ message: 'Not authorized to view chapters for this subject' });
    }

    const chapters = await Chapter.find({ subjectId });
    return res.json(chapters);
  } catch (err) {
    return res.status(500).json({ message: 'Unable to fetch chapters', error: err.message });
  }
};
