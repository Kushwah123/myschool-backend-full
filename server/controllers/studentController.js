




// ===================== studentController.js =====================
const Student = require('../models/Student');
const Class = require('../models/Class');

const generateAdmissionNumber = async () => {
  const count = await Student.countDocuments();
  return `ADM${1001 + count}`;
};

// const generateRollNumber = async (classId) => {
//   const studentsInClass = await Student.find({ classId });
//   return `${classId.toString().slice(-2)}-${studentsInClass.length + 1}`;
// };

const generateRollNumber = async (classId) => {
  const studentsInClass = await Student.find({ classId });
  return studentsInClass.length + 1;
};


exports.addStudent = async (req, res) => {
  try {
    const {
      fullName, gender, dob, aadharNumber, bloodGroup, category,
      mobile, address, fatherName, motherName,
      classId, sectionId, transportMode,villageId
    } = req.body;
console.log(req.body);
    const photo = req.file ? req.file.filename : null;
    const admissionNumber = await generateAdmissionNumber();
    const rollNumber = await generateRollNumber(classId);

    const student = new Student({
      fullName,
      gender,
      dob,
      aadharNumber,
      bloodGroup,
      category,
      photo,
      mobile,
      address,
      fatherName,
      motherName,
      admissionNumber,
      rollNumber,
      classId,
      sectionId,
      transportMode,
      villageId,
      password: 'student123'
    });

    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📄 Get All Students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('classId').populate('villageId');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get Single Student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('classId').populate('villageId');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update Student by ID
exports.updateStudent = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ message: 'Student updated', updatedStudent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Delete Student by ID
exports.deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Delete multiple students
exports.deleteMultipleStudents = async (req, res) => {
  try {
    const { ids } = req.body; // ids = array of student IDs

    if (!Array.isArray(ids)) {
      return res.status(400).json({ message: 'Invalid data. IDs must be an array.' });
    }

    await Student.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: 'Selected students deleted successfully.' });
  } catch (error) {
    console.error('Delete multiple students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getStudentsByClass = async (req, res) => {
  try {
    const students = await Student.find({ classId: req.params.classId }).populate('user').
    populate('parent').populate('villageId');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
