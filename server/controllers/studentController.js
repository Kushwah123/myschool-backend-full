




// ===================== studentController.js =====================
const Student = require('../models/Student');
const Class = require('../models/Class');
const Village = require("../models/Village");
const XLSX = require("xlsx");
const multer = require("multer");
const bcrypt = require('bcryptjs');
const { validateStudentData, validateAadhar, validateMobileNumber } = require('../utils/validators');

// ✅ Secure Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/students/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// ✅ Generate secure password
const generateSecurePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const generateAdmissionNumber = async () => {
  const lastStudent = await Student.findOne().sort({ createdAt: -1 });
  if (!lastStudent || !lastStudent.admissionNumber || typeof lastStudent.admissionNumber !== 'string') {
    return "ADM1001";
  }

  const numericPart = lastStudent.admissionNumber.replace(/[^0-9]/g, '');
  const lastNumber = parseInt(numericPart, 10);
  if (isNaN(lastNumber)) {
    return "ADM1001";
  }

  return `ADM${lastNumber + 1}`;
};

const generateRollNumber = async (classId) => {
  const studentsInClass = await Student.find({ classId });
  return studentsInClass.length + 1;
};


// ✅ Add Student with Validation
exports.addStudent = async (req, res) => {
  try {
    const {
      fullName, gender, dob, aadharNumber, bloodGroup, category,
      mobile, address, fatherName, motherName,
      classId, sectionId, transportMode, villageId
    } = req.body;

    // ✅ Validate student data
    const validation = validateStudentData({
      fullName,
      gender,
      dob,
      aadharNumber,
      mobile,
      fatherName,
      motherName,
      address,
      classId,
    });

    if (!validation.isValid) {
      return res.status(400).json({ 
        msg: 'Validation failed',
        errors: validation.errors 
      });
    }

    // Check if student with same aadhar already exists
    if (aadharNumber) {
      const existingStudent = await Student.findOne({ aadharNumber });
      if (existingStudent) {
        return res.status(400).json({ msg: 'Student with this Aadhar number already exists' });
      }
    }

    const photo = req.file ? req.file.filename : null;
    const admissionNumber = await generateAdmissionNumber();
    const rollNumber = await generateRollNumber(classId);
    const securePassword = generateSecurePassword();
    const hashedPassword = await bcrypt.hash(securePassword, 12);

    const studentData = {
      fullName: fullName.trim(),
      gender,
      dob,
      bloodGroup,
      category,
      photo,
      mobile,
      address,
      fatherName: fatherName.trim(),
      motherName,
      admissionNumber,
      rollNumber,
      classId,
      sectionId,
      transportMode,
      villageId,
      password: hashedPassword
    };

    if (aadharNumber) {
      studentData.aadharNumber = aadharNumber;
    }

    const student = new Student(studentData);

    await student.save();
    
    // Return without password
    const studentResponse = student.toObject();
    delete studentResponse.password;
    studentResponse.tempPassword = securePassword; // Only return at creation

    res.status(201).json({ 
      msg: 'Student added successfully',
      data: studentResponse
    });
  } catch (error) {
    console.error('Add Student Error:', error);
    res.status(500).json({ msg: 'Server error while adding student' });
  }
};





exports.importStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const selectedClassId = req.body.classId || null;
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const getValue = (row, keys) => {
      for (const key of keys) {
        if (row[key] !== undefined && row[key] !== null && row[key].toString().trim() !== "") {
          return row[key];
        }
      }
      return null;
    };

    const rowHasAnyValue = (row) => {
      return Object.values(row).some((value) => value !== undefined && value !== null && value.toString().trim() !== "");
    };

    // Determine starting admission number once for this import
    const lastAdmissionRecord = await Student.aggregate([
      { $match: { admissionNumber: { $exists: true, $ne: null } } },
      { $project: { admissionNumber: 1, numeric: { $toInt: { $substr: ["$admissionNumber", 3, 100] } } } },
      { $sort: { numeric: -1 } },
      { $limit: 1 }
    ]);

    let nextAdmissionValue = 1001;
    if (lastAdmissionRecord.length > 0 && Number.isInteger(lastAdmissionRecord[0].numeric)) {
      nextAdmissionValue = lastAdmissionRecord[0].numeric + 1;
    }

    let studentsToInsert = [];
    let errors = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!rowHasAnyValue(row)) {
        continue; // Skip completely empty rows from Excel
      }

      const classId = getValue(row, ["ClassId", "Class Id"]) || selectedClassId;
      const studentName = getValue(row, ["Student Name", "Student's Name", "Students Name"]);
      const fatherName = getValue(row, ["Father's Name", "Father Name"]);
      const motherName = getValue(row, ["Mother's Name", "Mother Name"]);
      const address = getValue(row, ["Address"]);
      const mobileRaw = getValue(row, ["Mobile Number", "Mobile No.", "Mobile"]);
      const dobValue = getValue(row, ["DOB", "Date of Birth", "Birth Date"]);
      const aadharRaw = getValue(row, ["Aadhar", "Aadhar Number", "Aadhar No."]);
      const villageId = getValue(row, ["VillageId", "Village ID", "villageId"]);

      const mobile = mobileRaw ? mobileRaw.toString().trim() : '';
      const aadhar = aadharRaw ? aadharRaw.toString().trim() : null;

      // Validate required fields
      if (!studentName || !fatherName || !motherName || !address || !classId) {
        errors.push(`Row ${i + 1}: Missing required fields (Student Name, Father's Name, Mother's Name, Address, ClassId)`);
        continue;
      }

      // Validate ClassId exists
      const classExists = await Class.findById(classId);
      if (!classExists) {
        errors.push(`Row ${i + 1}: Invalid ClassId ${classId}`);
        continue;
      }

      // Validate VillageId if provided; ignore invalid VillageId
      let validVillageId = null;
      if (villageId) {
        const villageExists = await Village.findById(villageId);
        validVillageId = villageExists ? villageId.toString().trim() : null;
      }

      // Normalize mobile if valid; otherwise keep blank
      const normalizedMobile = validateMobileNumber(mobile) ? mobile : '';

      // Parse date of birth if valid; otherwise leave null
      let dob = null;
      if (dobValue) {
        const parsedDOB = new Date(dobValue);
        if (!isNaN(parsedDOB.getTime())) {
          dob = parsedDOB;
        }
      }

      // Normalize Aadhar if valid; ignore invalid values
      const aadharNumber = aadhar && validateAadhar(aadhar) ? aadhar : null;

      // Check for duplicate Aadhar if valid
      if (aadharNumber) {
        const existing = await Student.findOne({ aadharNumber });
        if (existing) {
          errors.push(`Row ${i + 1}: Student with Aadhar ${aadharNumber} already exists`);
          continue;
        }
      }

      // Generate admission number sequentially for this import
      let admissionNumber;
      do {
        admissionNumber = `ADM${nextAdmissionValue}`;
        nextAdmissionValue += 1;
      } while (await Student.exists({ admissionNumber }));

      // Generate roll number
      const rollNumber = await generateRollNumber(classId);

      // Generate and hash password
      const securePassword = generateSecurePassword();
      const hashedPassword = await bcrypt.hash(securePassword, 12);

      const studentData = {
        fullName: studentName.toString().trim(),
        fatherName: fatherName.toString().trim(),
        motherName: motherName.toString().trim(),
        address: address.toString().trim(),
        mobile: normalizedMobile,
        classId,
        villageId: validVillageId,
        admissionNumber,
        rollNumber: rollNumber.toString(),
        gender: getValue(row, ["Gender"]) || "N/A",
        dob,
        bloodGroup: getValue(row, ["Blood Group"]) || "",
        category: getValue(row, ["Category"]) || "",
        password: hashedPassword,
        tempPassword: securePassword // For response, not saved
      };

      if (aadharNumber) {
        studentData.aadharNumber = aadharNumber;
      }

      studentsToInsert.push(studentData);
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation errors in Excel file",
        details: errors,
        imported: 0
      });
    }

    if (studentsToInsert.length === 0) {
      return res.status(400).json({ error: "No valid students to import" });
    }

    const data = await Student.insertMany(studentsToInsert);
    console.log("✅ Imported data", data.length);

    res.json({
      message: "Students imported successfully",
      count: studentsToInsert.length,
      students: data.map(s => ({ ...s.toObject(), tempPassword: studentsToInsert.find(st => st.admissionNumber === s.admissionNumber).tempPassword }))
    });
  } catch (error) {
    console.error("❌ Import error", error);
    res.status(500).json({ error: "Failed to import students", details: error.message });
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
    const students = await Student.find({ classId: req.params.classId }).populate('villageId');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
