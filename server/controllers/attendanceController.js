const Attendance = require('../models/attendanceModel');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Class = require('../models/Class');
const whatsappService = require('../utils/whatsappService');

// 📤 Send WhatsApp notification to parents
const sendAttendanceNotifications = async (attendanceRecords) => {
  try {
    if (!whatsappService.isClientReady()) {
      console.warn('WhatsApp client not ready. Notifications will not be sent.');
      return { sent: 0, failed: 0, message: 'WhatsApp client not ready' };
    }

    const recipients = [];
    const skippedParents = [];

    // Fetch student and parent information for each attendance record
    for (const record of attendanceRecords) {
      try {
        const student = await Student.findById(record.student).select('fullName mobile');
        if (!student) {
          console.log(`⚠️ Student not found for attendance student id: ${record.student}`);
          continue;
        }

        // Find parent(s) of this student
        const parents = await Parent.find({ studentIds: { $in: [record.student] } }).select('mobile fullName');
        console.log(`🔎 Parents found for student ${student.fullName} (${record.student}): ${parents.length}`);

        if (parents.length === 0) {
          console.log(`⚠️ No parent linked to student ${student.fullName} (${record.student}), trying student mobile fallback`);
          if (student.mobile) {
            const studentPhone = student.mobile.trim();
            const formattedStudentPhone = whatsappService.formatPhoneNumber(studentPhone);
            if (formattedStudentPhone) {
              const statusEmoji = record.status === 'Present' ? '✅' : '❌';
              const message = `*School Attendance Notification* 📚

${statusEmoji} ${student.fullName} is *${record.status}* today.

Date: ${new Date(record.date).toLocaleDateString()}

*Please keep us updated*`;

              recipients.push({
                phoneNumber: studentPhone,
                message,
                parentName: null,
                studentName: student.fullName,
              });
              console.log(`✨ Fallback message target: student mobile ${studentPhone}`);
            } else {
              skippedParents.push({
                studentName: student.fullName,
                parentName: null,
                phoneNumber: student.mobile,
                reason: 'Invalid student mobile format for fallback',
              });
            }
          } else {
            skippedParents.push({
              studentName: student.fullName,
              parentName: null,
              phoneNumber: null,
              reason: 'No parent linked to student and student mobile missing',
            });
          }
        }

        for (const parent of parents) {
          const phoneNumber = parent.mobile?.trim();
          if (!phoneNumber) {
            skippedParents.push({
              studentName: student.fullName,
              parentName: parent.fullName,
              phoneNumber: null,
              reason: 'Missing mobile number',
            });
            continue;
          }

          const formattedNumber = whatsappService.formatPhoneNumber(phoneNumber);
          if (!formattedNumber) {
            skippedParents.push({
              studentName: student.fullName,
              parentName: parent.fullName,
              phoneNumber,
              reason: 'Invalid mobile format',
            });
            continue;
          }

          const statusEmoji = record.status === 'Present' ? '✅' : '❌';
          const message = `*School Attendance Notification* 📚\n\n${statusEmoji} ${student.fullName} is *${record.status}* today.\n\nDate: ${new Date(record.date).toLocaleDateString()}\n\n*Please keep us updated*`;

          recipients.push({
            phoneNumber,
            message,
            parentName: parent.fullName,
            studentName: student.fullName,
          });
        }
      } catch (error) {
        console.error('Error processing attendance record:', error);
        continue;
      }
    }

    if (recipients.length === 0) {
      console.log('No parent contact information available for notifications');
      console.log('Skipped parents:', skippedParents);
      return {
        sent: 0,
        failed: 0,
        message: 'No valid parent numbers found',
        error: 'No valid parent numbers found',
        skipped: skippedParents,
      };
    }

    console.log(`📊 WhatsApp recipients prepared: ${recipients.length}`);
    console.log('Skipped parents:', skippedParents);

    // Send bulk messages
    const result = await whatsappService.sendBulkMessages(recipients);
    console.log(`📱 Attendance notifications sent: ${result.success} successful, ${result.failed} failed`);
    if (result.results) {
      console.log('Send results sample:', result.results.slice(0, 5));
    }

    return {
      ...result,
      skipped: skippedParents,
    };
  } catch (error) {
    console.error('Error sending attendance notifications:', error);
    return { sent: 0, failed: attendanceRecords.length, error: error.message };
  }
};

// ✅ Mark Attendance
exports.markAttendance = async (req, res) => {
  try {
    const { classId, date, records, teacherId, sendWhatsApp = true } = req.body;

    if (!classId || !date || !Array.isArray(records) || records.length === 0 || !teacherId) {
      return res.status(400).json({ message: 'classId, date, teacherId and attendance records are required' });
    }

    const attendanceDate = new Date(date);
    const studentIds = records
      .filter((record) => record && record.student)
      .map((record) => record.student);

    const existingRecords = await Attendance.find({
      student: { $in: studentIds },
      date: attendanceDate,
    });

    const existingByStudent = existingRecords.reduce((map, record) => {
      map[record.student.toString()] = record;
      return map;
    }, {});

    const attendanceDocs = [];
    const updatedRecords = [];
    const skipped = [];

    for (const record of records) {
      const { student, status } = record;
      if (!student || !status) {
        skipped.push({ student, reason: 'Missing student or status' });
        continue;
      }

      const existing = existingByStudent[student];
      if (existing) {
        if (existing.status !== status || existing.classId.toString() !== classId || existing.markedBy?.toString() !== teacherId) {
          existing.status = status;
          existing.classId = classId;
          existing.markedBy = teacherId;
          updatedRecords.push(existing);
        } else {
          skipped.push({ student, reason: 'Already marked with same status' });
        }
        continue;
      }

      attendanceDocs.push({
        student,
        classId,
        date: attendanceDate,
        status,
        markedBy: teacherId,
      });
    }

    if (attendanceDocs.length === 0 && updatedRecords.length === 0) {
      return res.status(400).json({ message: 'No new attendance records to save', skipped });
    }

    const saved = attendanceDocs.length > 0 ? await Attendance.insertMany(attendanceDocs) : [];
    const updated = [];

    if (updatedRecords.length > 0) {
      await Promise.all(updatedRecords.map((record) => record.save()));
      updated.push(...updatedRecords);
    }

    const allAttendance = [...saved, ...updated];

    let whatsappResult = null;
    if (sendWhatsApp && allAttendance.length > 0) {
      try {
        whatsappResult = await sendAttendanceNotifications(allAttendance);
      } catch (notificationError) {
        console.error('Error sending attendance WhatsApp notifications:', notificationError);
        whatsappResult = {
          success: 0,
          failed: allAttendance.length,
          error: notificationError.message || 'Notification error',
        };
      }
    }

    res.status(201).json({
      message: 'Attendance processed',
      attendance: allAttendance,
      savedCount: saved.length,
      updatedCount: updated.length,
      skipped,
      whatsapp: whatsappResult,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: 'Duplicate attendance entry detected. Existing attendance index conflict on class/date. Please drop the incorrect classId_1_date_1 index and retry.'
      });
    }
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

// 📊 Get Attendance Stats for Today or Specific Date
exports.getAttendanceStats = async (req, res) => {
  try {
    const { classId, teacherId, date } = req.query;
    const attendanceDate = date ? new Date(date) : new Date();
    const dateString = attendanceDate.toISOString().split('T')[0];
    const startOfDay = new Date(`${dateString}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateString}T23:59:59.999Z`);

    const query = {
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    };

    if (classId) query.classId = classId;
    if (teacherId) query.markedBy = teacherId;

    const attendance = await Attendance.find(query)
      .populate('student', 'fullName fatherName motherName mobile address')
      .populate('classId', 'name className section')
      .populate('markedBy', 'fullName');

    const present = attendance.filter((record) => record.status === 'Present').length;
    const absent = attendance.filter((record) => record.status === 'Absent').length;

    res.json({
      date: dateString,
      stats: {
        present,
        absent,
        total: attendance.length,
      },
      records: attendance,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📅 Get Monthly Attendance Summary
exports.getAttendanceMonthly = async (req, res) => {
  try {
    const { classId, teacherId, month, year } = req.query;
    const now = new Date();
    const monthNum = parseInt(month, 10) || now.getMonth() + 1;
    const yearNum = parseInt(year, 10) || now.getFullYear();

    const startOfMonth = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0, 0));
    const startOfNextMonth = new Date(Date.UTC(yearNum, monthNum, 1, 0, 0, 0, 0));
    const endOfMonth = new Date(startOfNextMonth.getTime() - 1);

    const query = {
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    };

    if (classId) query.classId = classId;
    if (teacherId) query.markedBy = teacherId;

    const attendanceRecords = await Attendance.find(query)
      .populate('student', 'fullName')
      .populate('classId', 'name className section');

    const groupedByDate = {};
    attendanceRecords.forEach((record) => {
      const dateStr = record.date.toISOString().split('T')[0];
      if (!groupedByDate[dateStr]) groupedByDate[dateStr] = [];
      groupedByDate[dateStr].push(record);
    });

    let classSize = null;
    if (classId) {
      classSize = await Student.countDocuments({ classId });
    }

    const rows = Object.entries(groupedByDate)
      .map(([date, records]) => {
        const present = records.filter((record) => record.status === 'Present').length;
        const absent = records.filter((record) => record.status === 'Absent').length;
        const total = records.length;
        const complete = classId ? total === classSize : true;
        return {
          date,
          present,
          absent,
          total,
          complete,
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    const completeRows = rows.filter((row) => row.complete);
    const totals = {
      present: completeRows.reduce((sum, row) => sum + row.present, 0),
      absent: completeRows.reduce((sum, row) => sum + row.absent, 0),
      days: completeRows.length,
      allDays: rows.length,
    };

    res.json({
      month: monthNum,
      year: yearNum,
      monthName: startOfMonth.toLocaleString('default', { month: 'long' }),
      classId: classId || null,
      teacherId: teacherId || null,
      totals,
      rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👨‍🎓 Get Student-Wise Monthly Attendance Table
exports.getAttendanceMonthlyStudent = async (req, res) => {
  try {
    const { classId, month, year } = req.query;
    if (!classId) {
      return res.status(400).json({ error: 'classId is required' });
    }

    const now = new Date();
    const monthNum = parseInt(month, 10) || now.getMonth() + 1;
    const yearNum = parseInt(year, 10) || now.getFullYear();

    const startOfMonth = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0, 0));
    const startOfNextMonth = new Date(Date.UTC(yearNum, monthNum, 1, 0, 0, 0, 0));
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    const dates = Array.from({ length: daysInMonth }, (_, index) => {
      const day = new Date(Date.UTC(yearNum, monthNum - 1, index + 1, 0, 0, 0, 0));
      return day.toISOString().split('T')[0];
    });

    const classSize = await Student.countDocuments({ classId });
    const students = await Student.find({ classId })
      .select('fullName rollNumber')
      .sort({ rollNumber: 1, fullName: 1 })
      .lean();

    const attendanceRecords = await Attendance.find({
      classId,
      date: {
        $gte: startOfMonth,
        $lt: startOfNextMonth,
      },
    })
      .select('student date status')
      .lean();

    const recordMap = new Map();
    const dateCounts = {};

    attendanceRecords.forEach((record) => {
      const dateStr = record.date.toISOString().split('T')[0];
      const key = `${record.student.toString()}|${dateStr}`;
      recordMap.set(key, record.status);
      dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
    });

    const completeDates = new Set(
      Object.entries(dateCounts)
        .filter(([, count]) => count === classSize)
        .map(([date]) => date)
    );

    const studentsWithAttendance = students.map((student) => {
      let presentCount = 0;
      let absentCount = 0;
      const attendanceByDate = {};

      dates.forEach((date) => {
        const key = `${student._id.toString()}|${date}`;
        const status = recordMap.get(key) || null;
        attendanceByDate[date] = status;

        if (status === 'Present') {
          presentCount += 1;
        }
        if (status === 'Absent') {
          absentCount += 1;
        }
      });

      return {
        studentId: student._id,
        fullName: student.fullName,
        rollNumber: student.rollNumber,
        attendanceByDate,
        presentCount,
        absentCount,
      };
    });

    const totals = {
      present: studentsWithAttendance.reduce((sum, student) => sum + student.presentCount, 0),
      absent: studentsWithAttendance.reduce((sum, student) => sum + student.absentCount, 0),
      studentCount: students.length,
      completeDays: completeDates.size,
      totalDays: dates.length,
    };

    res.json({
      month: monthNum,
      year: yearNum,
      days: dates,
      classId,
      classSize,
      completeDays: Array.from(completeDates),
      students: studentsWithAttendance,
      totals,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
