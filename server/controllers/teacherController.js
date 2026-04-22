const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');
const Class = require('../models/Class');
const Subject = require('../models/subjectModel');
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

// ✅ GET /api/teachers/:id
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select('-password');
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch teacher' });
  }
};

// 📝 Update teacher (admin)
exports.updateTeacher = async (req, res) => {
  try {
    const { password, ...updateData } = req.body; // Exclude password from updates

    // Check if email is being updated and if it conflicts with another teacher
    if (updateData.email) {
      const existingTeacher = await Teacher.findOne({ email: updateData.email });
      if (existingTeacher && existingTeacher._id.toString() !== req.params.id) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    const updated = await Teacher.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Teacher not found' });
    res.json({ message: 'Teacher updated', teacher: updated });
  } catch (err) {
    res.status(500).json({ message: 'Unable to update teacher', error: err.message });
  }
};

// 🗑️ Delete teacher (admin)
exports.deleteTeacher = async (req, res) => {
  try {
    const deleted = await Teacher.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Teacher not found' });
    res.json({ message: 'Teacher deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Unable to delete teacher', error: err.message });
  }
};

// ➕ Assign Subject to Teacher
exports.assignSubject = async (req, res) => {
  try {
    const { teacherId, classId, subjectId } = req.body;

    if (!teacherId || !classId || !subjectId) {
      return res.status(400).json({ message: 'teacherId, classId, and subjectId are required' });
    }

    const [teacher, classObj, subject] = await Promise.all([
      Teacher.findById(teacherId),
      Class.findById(classId),
      Subject.findById(subjectId)
    ]);

    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    if (!classObj) return res.status(404).json({ message: 'Class not found' });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    if (subject.classId.toString() !== classId.toString()) {
      return res.status(400).json({ message: 'Subject does not belong to the provided class' });
    }

    const existingMapping = await TeacherSubject.findOne({ teacherId, classId, subjectId });
    if (existingMapping) {
      return res.status(400).json({ message: 'This subject is already assigned to the teacher for this class' });
    }

    const mapping = new TeacherSubject({ teacherId, classId, subjectId });
    await mapping.save();

    if (!teacher.assignedClasses) teacher.assignedClasses = [];
    if (!teacher.assignedClasses.map(String).includes(classId.toString())) {
      teacher.assignedClasses.push(classId);
    }
    if (!teacher.subjects) teacher.subjects = [];
    if (!teacher.subjects.map(String).includes(subjectId.toString())) {
      teacher.subjects.push(subjectId);
    }
    await teacher.save();

    subject.assignedTeacher = teacherId;
    await subject.save();

    return res.status(201).json({ message: 'Subject assigned to teacher successfully', mapping });
  } catch (err) {
    return res.status(500).json({ message: 'Unable to assign subject', error: err.message });
  }
};

// 📄 Get assigned classes and subjects for teacher
exports.getMyClasses = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can access this endpoint' });
    }

    const teacher = await findTeacherProfile(req.user);
    if (!teacher) {
      return res.status(403).json({ message: 'Teacher profile not found' });
    }

    const mappings = await TeacherSubject.find({ teacherId: teacher._id }).populate('subjectId').populate('classId');
    const classIds = new Set([
      ...(teacher.assignedClasses || []).map((id) => id.toString()),
      ...mappings.filter((mapping) => mapping.classId).map((mapping) => mapping.classId._id.toString())
    ]);

    const classes = await Class.find({ _id: { $in: Array.from(classIds) } });
    const subjectsByClass = {};
    mappings.forEach((mapping) => {
      const classIdKey = mapping.classId?._id?.toString();
      if (!classIdKey) return;
      if (!subjectsByClass[classIdKey]) subjectsByClass[classIdKey] = [];
      subjectsByClass[classIdKey].push(mapping.subjectId);
    });

    const classList = classes.map((classDoc) => ({
      class: classDoc,
      subjects: subjectsByClass[classDoc._id.toString()] || []
    }));

    return res.json({ teacher: { id: teacher._id, name: teacher.name, email: teacher.email }, classes: classList });
  } catch (err) {
    return res.status(500).json({ message: 'Unable to fetch assigned classes', error: err.message });
  }
};
