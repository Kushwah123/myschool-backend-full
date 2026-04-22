const Complaint = require('../models/Complaint');
const Student = require('../models/Student');
const User = require('../models/User');
const Parent = require('../models/Parent');
const whatsappService = require('../utils/whatsappService');

const buildComplaintMessage = ({ studentName, teacherName, subject, description }) => {
  return `*New Complaint Raised*\n\nStudent: ${studentName}\nTeacher: ${teacherName}\nSubject: ${subject}\nDescription: ${description}\n\nPlease respond to the teacher if needed.`;
};

const findComplaintPhone = async (studentId, student) => {
  let phoneNumber = student?.mobile?.trim();
  let phoneType = 'student';
  let parentInfo = null;

  if (!whatsappService.formatPhoneNumber(phoneNumber)) {
    const parents = await Parent.find({ studentIds: { $in: [studentId] } }).select('fullName mobile');
    const validParent = parents.find((parent) => whatsappService.formatPhoneNumber(parent.mobile?.trim()));
    if (validParent) {
      phoneNumber = validParent.mobile?.trim();
      phoneType = 'parent';
      parentInfo = validParent;
    }
  }

  return { phoneNumber, phoneType, parentInfo };
};

exports.createComplaint = async (req, res) => {
  try {
    const { studentId, subject, description } = req.body;
    const teacherId = req.user?._id;

    if (!studentId || !subject || !description) {
      return res.status(400).json({ error: 'studentId, subject and description are required' });
    }

    if (!req.user || req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can create complaints' });
    }

    const student = await Student.findById(studentId).select('fullName mobile');
    const teacher = await User.findById(teacherId).select('name email mobile role');

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const complaint = await Complaint.create({
      studentId,
      teacherId,
      subject,
      description,
    });

    let whatsappResult = {
      success: false,
      reason: 'WhatsApp client not ready or no valid phone available',
    };

    try {
      if (whatsappService.isClientReady()) {
        const { phoneNumber, phoneType, parentInfo } = await findComplaintPhone(studentId, student);
        if (phoneNumber && whatsappService.formatPhoneNumber(phoneNumber)) {
          whatsappResult = await whatsappService.sendMessage(
            phoneNumber,
            buildComplaintMessage({
              studentName: student.fullName,
              teacherName: teacher.name,
              subject,
              description,
            })
          );
          whatsappResult.phoneNumber = phoneNumber;
          whatsappResult.phoneType = phoneType;
          whatsappResult.parentName = parentInfo?.fullName || null;
        }
      } else {
        whatsappResult.reason = 'WhatsApp client not ready';
      }
    } catch (err) {
      whatsappResult = {
        success: false,
        reason: err.message || 'WhatsApp send failed',
      };
    }

    complaint.whatsappSent = whatsappResult.success === true;
    complaint.whatsappResult = whatsappResult;
    await complaint.save();

    res.status(201).json({ complaint, whatsapp: whatsappResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('studentId', 'fullName mobile classId')
      .populate('teacherId', 'name email mobile role')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComplaintsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const complaints = await Complaint.find({ studentId })
      .populate('studentId', 'fullName mobile classId')
      .populate('teacherId', 'name email mobile role')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComplaintsByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const complaints = await Complaint.find({ teacherId })
      .populate('studentId', 'fullName mobile classId')
      .populate('teacherId', 'name email mobile role')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('studentId', 'fullName mobile classId')
      .populate('teacherId', 'name email mobile role');

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
