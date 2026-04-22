const mongoose = require('mongoose');
const Class = require('./models/Class');
const Subject = require('./models/subjectModel');
const Teacher = require('./models/Teacher');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Class.deleteMany({});
    await Subject.deleteMany({});
    await Teacher.deleteMany({});

    // Create sample teachers
    const teachers = await Teacher.insertMany([
      { name: 'Mr. Sharma', email: 'sharma@example.com', mobile: '9876543210', username: '9876543210', password: 'password123', role: 'teacher' },
      { name: 'Ms. Gupta', email: 'gupta@example.com', mobile: '9876543211', username: '9876543211', password: 'password123', role: 'teacher' },
      { name: 'Mr. Verma', email: 'verma@example.com', mobile: '9876543212', username: '9876543212', password: 'password123', role: 'teacher' }
    ]);

    // Create sample classes
    const classes = await Class.insertMany([
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
    ]);

    // Create sample subjects
    const subjects = await Subject.insertMany([
      { name: 'Mathematics', code: 'MATH', assignedTeacher: teachers[0]._id, classId: classes[0]._id },
      { name: 'English', code: 'ENG', assignedTeacher: teachers[1]._id, classId: classes[0]._id },
      { name: 'Science', code: 'SCI', assignedTeacher: teachers[2]._id, classId: classes[0]._id },
      { name: 'Hindi', code: 'HIN', assignedTeacher: teachers[0]._id, classId: classes[1]._id },
      { name: 'Social Studies', code: 'SST', assignedTeacher: teachers[1]._id, classId: classes[1]._id }
    ]);

    // Create example exam for first class/subject
    const Exam = require('./models/examModel');
    await Exam.create({
      name: 'Mid Term 1',
      type: 'mid-term',
      classId: classes[0]._id,
      subjectId: subjects[0]._id,
      createdBy: teachers[0]._id
    });

    console.log('Data seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
