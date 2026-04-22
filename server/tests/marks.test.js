// ✅ Marks & Exams Tests
const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Subject = require('../models/subjectModel');
const Exam = require('../models/examModel');
const Marks = require('../models/marksModel');
const bcrypt = require('bcryptjs');

let app;
let teacherToken;
let classId;
let subjectId;
let examId;
let studentId;

beforeAll(async () => {
  app = require('../server');
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
  }
});

afterAll(async () => {
  await User.deleteMany({});
  await Teacher.deleteMany({});
  await Class.deleteMany({});
  await Subject.deleteMany({});
  await Exam.deleteMany({});
  await Marks.deleteMany({});
  await mongoose.disconnect();
});

describe('Exam and Marks workflow', () => {
  it('should create teacher and login', async () => {
    const hashed = await bcrypt.hash('teachpass', 12);
    const user = await User.create({ name:'T1', username:'t1', mobile:'9000000000', password:hashed, role:'teacher' });
    const teacher = await Teacher.create({ name:'T1', email:'t1@example.com', password:hashed, mobile:'9000000000', classIds:[], subjects:[] });

    const res = await request(app).post('/api/auth/login').send({ identifier:'t1', password:'teachpass' });
    expect(res.statusCode).toBe(200);
    teacherToken = res.body.token;
  });

  it('should setup class and subject', async () => {
    const cls = await Class.create({ name:'Class A', section:'A' });
    classId = cls._id.toString();
    const subj = await Subject.create({ name:'Math', code:'MATH' });
    subjectId = subj._id.toString();
    // update teacher profile
    await Teacher.updateOne({ mobile:'9000000000' }, { $push: { classIds: cls._id, subjects: subj._id } });
  });

  it('should create an exam', async () => {
    const res = await request(app)
      .post('/api/exams')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ name:'Mid Term 1', type:'mid-term', classId, subjectId });
    expect(res.statusCode).toBe(201);
    examId = res.body.exam._id;
  });

  it('should add marks for a student', async () => {
    const student = await mongoose.model('Student').create({
      fullName:'Stu1',
      gender:'male',
      dob:new Date('2010-01-01'),
      fatherName:'Parent',
      rollNumber:'1',
      password:'pass123',
      mobile:'9000000001',
      classId
    });
    studentId = student._id.toString();
    const res = await request(app)
      .post('/api/marks')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ student: studentId, subject: subjectId, classId, exam: examId, marksObtained: 85, totalMarks: 100 });
    expect(res.statusCode).toBe(201);
    expect(res.body.marks.grade).toBe('A');
  });

  it('unauthorized teacher cannot add marks for other class', async () => {
    // create second teacher without permissions
    const hashed = await bcrypt.hash('teach2pass', 12);
    await User.create({ name:'T2', username:'t2', mobile:'9000000002', password:hashed, role:'teacher' });
    await Teacher.create({ name:'T2', email:'t2@example.com', password:hashed, mobile:'9000000002', classIds:[], subjects:[] });
    const resLogin = await request(app).post('/api/auth/login').send({ identifier:'t2', password:'teach2pass' });
    const token2 = resLogin.body.token;

    const res = await request(app)
      .post('/api/marks')
      .set('Authorization', `Bearer ${token2}`)
      .send({ student: studentId, subject: subjectId, classId, exam: examId, marksObtained: 70, totalMarks: 100 });
    expect(res.statusCode).toBe(403);
  });

  it('should fetch student marks report', async () => {
    const res = await request(app)
      .get(`/api/marks/student/${studentId}`)
      .set('Authorization', `Bearer ${teacherToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('should fetch class analytics', async () => {
    const res = await request(app)
      .get(`/api/marks/analytics/class/${classId}`)
      .set('Authorization', `Bearer ${teacherToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body[0].avgPercent).toBeCloseTo(85);
  });
});
