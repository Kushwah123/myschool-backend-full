const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler } = require('./utils/errorHandler');
const whatsappService = require('./utils/whatsappService');
const Attendance = require('./models/attendanceModel');

const app = express();
dotenv.config();

// Middleware

app.use(cors());
app.use(express.json());

// Initialize WhatsApp Service
if (process.env.NODE_ENV !== 'test' && process.env.WHATSAPP_ENABLED !== 'false') {
  console.log('📱 Initializing WhatsApp service...');
  // The service is automatically initialized when imported, just log it
  setTimeout(() => {
    if (whatsappService.isClientReady()) {
      console.log('✅ WhatsApp service is ready!');
    } else {
      console.log('⏳ WhatsApp service is initializing. Please scan the QR code above.');
    }
  }, 3000);
} else if (process.env.WHATSAPP_ENABLED === 'false') {
  console.log('📱 WhatsApp service is disabled');
} else {
  console.log('📱 WhatsApp service initialization skipped in test environment');
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('✅ MongoDB connected');
  await fixAttendanceIndexes();
})
.catch((err) => console.error('❌ MongoDB connection error:', err));

const fixAttendanceIndexes = async () => {
  try {
    const indexes = await Attendance.collection.indexes();
    const classDateIndex = indexes.find((idx) => idx.name === 'classId_1_date_1');

    if (classDateIndex && classDateIndex.unique) {
      await Attendance.collection.dropIndex('classId_1_date_1');
      console.log('✅ Dropped incorrect unique index classId_1_date_1 on Attendance collection');
    }

    const studentDateIndex = indexes.find((idx) => idx.name === 'student_1_date_1');
    if (!studentDateIndex) {
      await Attendance.collection.createIndex({ student: 1, date: 1 }, { unique: true });
      console.log('✅ Created unique index student_1_date_1 on Attendance collection');
    }
  } catch (err) {
    console.error('❌ Attendance index fix failed:', err);
  }
}

// Import Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const parentRoutes = require('./routes/parentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const classRoutes = require('./routes/classRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const feeRoutes = require('./routes/feeRoutes');
const marksRoutes = require('./routes/marksRoutes');
const examRoutes = require('./routes/examRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const homeworkRoutes = require('./routes/homeworkRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const villageRoutes = require('./routes/villageRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const chapterRoutes = require('./routes/chapterRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/homework', homeworkRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/villages', villageRoutes);
app.use('/api/complaints', complaintRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('🎓 School Management System Backend Running');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, msg: 'Route not found' });
});

// Centralized Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
