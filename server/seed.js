const mongoose = require('mongoose');
const Class = require('./models/Class');
const Subject = require('./models/subjectModel');
const Teacher = require('./models/Teacher');
require('dotenv').config();

const seedData = async () => {
  const seedEnabled = String(process.env.SEED_ENABLED || '').toLowerCase() === 'true';
  if (!seedEnabled) {
    console.log('⏭️ seed.js skipped: SEED_ENABLED is not true');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // --------- Idempotent helpers (NO deletes) ---------
    const upsertTeacher = async (t) => {
      // Teacher model in this repo commonly uses: mobile/username as identity
      const existing = await Teacher.findOne({ $or: [{ mobile: t.mobile }, { username: t.username }] }).lean();
      if (existing) {
        return existing;
      }
      return Teacher.create({ ...t });
    };

    const upsertClass = async (c) => {
      const existing = await Class.findOne({ name: c.name, section: c.section }).lean();
      if (existing) {
        return existing;
      }
      return Class.create({ ...c });
    };

    const upsertSubject = async (s) => {
      const existing = await Subject.findOne({ code: s.code }).lean();
      if (existing) {
        return existing;
      }
      return Subject.create({ ...s });
    };

    const upsertAdmin = async () => {
      const User = require('./models/User');
      const bcrypt = require('bcryptjs');

      const adminMobile = '8909861356';
      const existingAdmin = await User.findOne({ $or: [{ mobile: adminMobile }, { username: adminMobile }, { role: 'admin' }] }).lean();
      if (existingAdmin) {
        console.log('✅ Admin already exists, not modifying');
        return existingAdmin;
      }

      const hashed = await bcrypt.hash('admin@123', 12);
      const created = await User.create({
        name: 'Admin User',
        username: adminMobile,
        mobile: adminMobile,
        password: hashed,
        role: 'admin',
        isActive: true
      });
      console.log('✅ Admin created (upsert behavior)');
      return created;
    };

    // Create sample teachers (only missing)
    const teacherSeeds = [
      { name: 'Mr. Sharma', email: 'sharma@example.com', mobile: '9876543210', username: '9876543210', password: 'password123', role: 'teacher' },
      { name: 'Ms. Gupta', email: 'gupta@example.com', mobile: '9876543211', username: '9876543211', password: 'password123', role: 'teacher' },
      { name: 'Mr. Verma', email: 'verma@example.com', mobile: '9876543212', username: '9876543212', password: 'password123', role: 'teacher' }
    ];

    const teachers = [];
    for (const t of teacherSeeds) {
      const teacher = await upsertTeacher(t);
      teachers.push(teacher);
    }

    // Create sample classes (only missing)
    const classSeeds = [
      { name: 'Class 1', section: 'A' },
      { name: 'Class 2', section: 'A' },
      { name: 'Class 3', section: 'A' },
      { name: 'Class 4', section: 'A' },
      { name: 'Class 5', section: 'A' },
      { name: 'Class 6', section: 'A' },
      { name: 'Class 7', section: 'A' },
      { name: 'Class 8', section: 'A' },
      { name: 'Class 9', section: 'A' },
      { name: 'Class 10', section: 'A' }
    ];

    const classes = [];
    for (const c of classSeeds) {
      const cls = await upsertClass(c);
      classes.push(cls);
    }

    // Create sample subjects (only missing)
    const subjectSeeds = [
      { name: 'Mathematics', code: 'MATH', assignedTeacher: teachers[0]?._id, classId: classes[0]?._id },
      { name: 'English', code: 'ENG', assignedTeacher: teachers[1]?._id, classId: classes[0]?._id },
      { name: 'Science', code: 'SCI', assignedTeacher: teachers[2]?._id, classId: classes[0]?._id },
      { name: 'Hindi', code: 'HIN', assignedTeacher: teachers[0]?._id, classId: classes[1]?._id },
      { name: 'Social Studies', code: 'SST', assignedTeacher: teachers[1]?._id, classId: classes[1]?._id }
    ];

    const subjects = [];
    for (const s of subjectSeeds) {
      const subject = await upsertSubject(s);
      subjects.push(subject);
    }

    await upsertAdmin();

    // Create example exam (only missing) - prevent duplicates by unique-ish constraint
    const Exam = require('./models/examModel');
    const examName = 'Mid Term 1';
    const existingExam = await Exam.findOne({ name: examName }).lean();
    if (!existingExam) {
      await Exam.create({
        name: examName,
        type: 'mid-term',
        classId: classes[0]?._id,
        subjectId: subjects[0]?._id,
        createdBy: teachers[0]?._id
      });
      console.log('✅ Example exam created');
    } else {
      console.log('✅ Example exam already exists, not creating');
    }

    console.log('🎉 Seed completed successfully (idempotent, non-destructive)');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

