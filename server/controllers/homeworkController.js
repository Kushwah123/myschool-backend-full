const Homework = require('../models/Homework');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Teacher = require('../models/Teacher');
const whatsappService = require('../utils/whatsappService');

// ✅ Add Homework and Send via WhatsApp
exports.addHomeworkAndSend = async (req, res) => {
  try {
    const { title, description, classIds, subject, dueDate } = req.body;
    const teacherId = req.user._id; // From authentication middleware
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : '';

    // Validate classIds is an array
    if (!Array.isArray(classIds) || classIds.length === 0) {
      return res.status(400).json({ error: 'Please select at least one class' });
    }

    // Create homework record
    const newHomework = new Homework({ 
      title, 
      description, 
      classIds, 
      subject, 
      teacher: teacherId, 
      dueDate, 
      fileUrl,
      whatsappStatus: 'pending',
      recipients: []
    });

    // Fetch all students from selected classes
    const students = await Student.find({ classId: { $in: classIds } })
      .populate('classId');

    if (students.length === 0) {
      return res.status(404).json({ error: 'No students found in selected classes' });
    }

    // Prepare recipients list
    const recipients = [];
    const parentPhones = new Set(); // To avoid duplicate messages

    for (const student of students) {
      // Get parent phone number
      const parent = await Parent.findOne({ studentIds: student._id });
      
      if (parent && parent.mobile) {
        recipients.push({
          studentId: student._id,
          parentId: parent._id,
          phoneNumber: parent.mobile,
          status: 'pending'
        });
        parentPhones.add(parent.mobile);
      }
    }

    newHomework.recipients = recipients;
    newHomework.totalRecipients = recipients.length;
    newHomework.whatsappStatus = 'sending';
    await newHomework.save();

    // Prepare WhatsApp message
    const className = students[0].classId?.name || 'Your class';
    const message = `📚 *Homework Alert* 📚\n\n*${title}*\n\n${description}\n\n📅 Due Date: ${dueDate ? new Date(dueDate).toLocaleDateString() : 'Not specified'}\n\nClass: ${className}\n\n*From:* ${req.user.name || 'Teacher'}`;

    // Send messages via WhatsApp
    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      const result = await whatsappService.sendMessage(recipient.phoneNumber, message);

      if (result.success) {
        recipients[i].status = 'sent';
        recipients[i].sentTime = new Date();
        successCount++;
      } else {
        recipients[i].status = 'failed';
        recipients[i].errorReason = result.reason || 'Unknown error';
        failedCount++;
      }
    }

    // Update homework record
    newHomework.recipients = recipients;
    newHomework.successfulSends = successCount;
    newHomework.failedSends = failedCount;
    newHomework.whatsappStatus = successCount > 0 ? 'completed' : 'failed';
    newHomework.sentAt = new Date();
    await newHomework.save();

    res.status(201).json({ 
      message: 'Homework created and sent successfully', 
      homework: newHomework,
      summary: {
        total: recipients.length,
        sent: successCount,
        failed: failedCount
      }
    });
  } catch (error) {
    console.error('Homework send error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Fetch by class
exports.fetchHomeworkByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const homework = await Homework.find({ classIds: classId })
      .populate('teacher', 'name mobile email')
      .populate('classIds', 'name')
      .sort({ createdAt: -1 });
    
    res.json(homework);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Fetch by student (via student.classId)
exports.fetchHomeworkByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const homework = await Homework.find({ classIds: student.classId })
      .populate('teacher', 'name')
      .populate('classIds', 'name')
      .sort({ createdAt: -1 });
    
    res.json(homework);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get homework by teacher
exports.getTeacherHomework = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const homework = await Homework.find({ teacher: teacherId })
      .populate('classIds', 'name')
      .populate('teacher', 'name mobile email')
      .sort({ createdAt: -1 });

    res.json({ 
      homework,
      stats: {
        total: homework.length,
        sent: homework.filter(hw => hw.whatsappStatus === 'completed').length,
        failed: homework.filter(hw => hw.whatsappStatus === 'failed').length,
        pending: homework.filter(hw => hw.whatsappStatus === 'pending').length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all homework (Admin Panel)
exports.getAllHomework = async (req, res) => {
  try {
    const { status, teacherId, classId, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (status) filter.whatsappStatus = status;
    if (teacherId) filter.teacher = teacherId;
    if (classId) filter.classIds = classId;

    const skip = (page - 1) * limit;
    
    const homework = await Homework.find(filter)
      .populate('teacher', 'name mobile email')
      .populate('classIds', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Homework.countDocuments(filter);

    res.json({ 
      homework,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      },
      stats: {
        completed: await Homework.countDocuments({ ...filter, whatsappStatus: 'completed' }),
        failed: await Homework.countDocuments({ ...filter, whatsappStatus: 'failed' }),
        pending: await Homework.countDocuments({ ...filter, whatsappStatus: 'pending' }),
        sending: await Homework.countDocuments({ ...filter, whatsappStatus: 'sending' })
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get homework details with recipient info
exports.getHomeworkDetails = async (req, res) => {
  try {
    const { homeworkId } = req.params;
    const homework = await Homework.findById(homeworkId)
      .populate('teacher', 'name mobile email')
      .populate('classIds', 'name')
      .populate('recipients.studentId', 'fullName admissionNumber')
      .populate('recipients.parentId', 'fullName mobile');

    if (!homework) {
      return res.status(404).json({ error: 'Homework not found' });
    }

    res.json(homework);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update homework (teacher can only edit unsent)
exports.updateHomework = async (req, res) => {
  try {
    const { homeworkId } = req.params;
    const homework = await Homework.findById(homeworkId);

    if (!homework) {
      return res.status(404).json({ error: 'Homework not found' });
    }

    if (homework.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only teacher who created can edit' });
    }

    if (homework.whatsappStatus !== 'pending') {
      return res.status(400).json({ error: 'Cannot edit homework that has been sent' });
    }

    const { title, description, classIds, subject, dueDate } = req.body;
    
    homework.title = title || homework.title;
    homework.description = description || homework.description;
    homework.classIds = classIds || homework.classIds;
    homework.subject = subject || homework.subject;
    homework.dueDate = dueDate || homework.dueDate;

    await homework.save();
    res.json({ message: 'Homework updated successfully', homework });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete homework (only if not sent)
exports.deleteHomework = async (req, res) => {
  try {
    const { homeworkId } = req.params;
    const homework = await Homework.findById(homeworkId);

    if (!homework) {
      return res.status(404).json({ error: 'Homework not found' });
    }

    if (homework.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only teacher who created can delete' });
    }

    if (homework.whatsappStatus !== 'pending') {
      return res.status(400).json({ error: 'Cannot delete homework that has been sent' });
    }

    await Homework.findByIdAndDelete(homeworkId);
    res.json({ message: 'Homework deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Resend failed homework messages
exports.resendFailedMessages = async (req, res) => {
  try {
    const { homeworkId } = req.params;
    const homework = await Homework.findById(homeworkId);

    if (!homework) {
      return res.status(404).json({ error: 'Homework not found' });
    }

    // Get only failed recipients
    const failedRecipients = homework.recipients.filter(r => r.status === 'failed');
    
    if (failedRecipients.length === 0) {
      return res.status(400).json({ message: 'No failed messages to resend' });
    }

    // Prepare message
    const className = homework.classIds[0]?.name || 'Class';
    const message = `📚 *Homework Alert* 📚\n\n*${homework.title}*\n\n${homework.description}\n\n📅 Due Date: ${homework.dueDate ? new Date(homework.dueDate).toLocaleDateString() : 'Not specified'}\n\nClass: ${className}`;

    // Resend messages
    let successCount = 0;
    for (const recipient of failedRecipients) {
      const result = await whatsappService.sendMessage(recipient.phoneNumber, message);
      
      if (result.success) {
        recipient.status = 'sent';
        recipient.sentTime = new Date();
        successCount++;
      }
    }

    homework.successfulSends += successCount;
    homework.failedSends -= successCount;
    await homework.save();

    res.json({ 
      message: 'Resend complete',
      resent: successCount,
      failed: failedRecipients.length - successCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
