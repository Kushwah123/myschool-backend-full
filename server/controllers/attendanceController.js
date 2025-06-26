const Attendance = require('../models/attendanceModel');

// ✅ Mark Attendance
exports.markAttendance = async (req, res) => {
  try {
    const { student, classId, date, status } = req.body;

    const existing = await Attendance.findOne({ student, date });
    if (existing) return res.status(400).json({ message: 'Attendance already marked for this date' });

    const newAttendance = new Attendance({ student, classId, date, status });
    await newAttendance.save();
    res.status(201).json({ message: 'Attendance marked', attendance: newAttendance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update Attendance
exports.updateAttendance = async (req, res) => {
  try {
    const updated = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Attendance updated', attendance: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📄 Get Attendance by Student
exports.getAttendanceByStudent = async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.params.studentId });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📘 Get Attendance by Class and Date
exports.getAttendanceByClassAndDate = async (req, res) => {
  try {
    const { classId, date } = req.params;
    const attendance = await Attendance.find({ classId, date });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
