// ✅ Parent Controller Tests
const request = require('supertest');
const mongoose = require('mongoose');
const Parent = require('../models/Parent');
const User = require('../models/User');
let app;

describe('Parent Controller Tests', () => {
  beforeAll(async () => {
    app = require('../server');
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
    }
  });

  afterEach(async () => {
    await Parent.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should register a parent and allow login using mobile as identifier', async () => {
    const parentData = {
      fullName: 'Parent One',
      mobile: '9876501234',
      email: 'parent1@example.com',
      villageId: null,
      studentIds: [],
      address: '123 Street'
    };

    // register
    const res1 = await request(app)
      .post('/api/parents/add')
      .send(parentData);

    expect(res1.statusCode).toBe(201);
    expect(res1.body.message).toContain('Parent registered successfully');

    // login using mobile
    const res2 = await request(app)
      .post('/api/parents/login')
      .send({ identifier: '9876501234', password: 'parent123' });

    expect(res2.statusCode).toBe(200);
    expect(res2.body.user.role).toBe('parent');
    expect(res2.body.token).toBeDefined();

    // login using email as well
    const res3 = await request(app)
      .post('/api/parents/login')
      .send({ identifier: 'parent1@example.com', password: 'parent123' });

    expect(res3.statusCode).toBe(200);
    expect(res3.body.user.role).toBe('parent');
  });
});