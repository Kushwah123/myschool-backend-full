// ✅ Auth Controller Tests
const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

describe('Auth Controller Tests', () => {
  let app;

  beforeAll(async () => {
    // Mock app setup
    app = require('../server');
    // Connect to test DB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  describe('POST /api/auth/signup', () => {
    it('should register a new user with valid data', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',          username: 'weakpassuser',          username: 'testuser',
          mobile: '9876543210',
          password: 'SecurePass@123',
          role: 'student'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.msg).toBe('User registered successfully');
      expect(res.body.user.mobile).toBe('9876543210');
    });

    it('should reject weak password', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          mobile: '9876543211',
          password: 'weak', // No uppercase, number, special char
          role: 'student'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.msg).toBe('Password validation failed');
      expect(res.body.errors.length).toBeGreaterThan(0);
    });

    it('should set username equal to mobile if not provided', async () => {
      const mobileValue = '9998887776';
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'No Username',
          mobile: mobileValue,
          password: 'SecurePass@123',
          role: 'student'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.user.username).toBe(mobileValue);
    });

    it('should reject invalid mobile number', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          username: 'invalidmobile',
          mobile: '123456', // Invalid format
          password: 'SecurePass@123',
          role: 'student'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.msg).toContain('mobile');
    });

    it('should reject invalid username format', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'User Name',
          username: 'ab', // too short
          mobile: '9876512345',
          password: 'SecurePass@123',
          role: 'student'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.msg).toContain('Invalid username');
    });

    it('should reject duplicate mobile', async () => {
      const mobile = '9876543212';
      
      // First signup (with a username that will be reused)
      await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'User One',
          username: 'duplicate',
          mobile: mobile,
          password: 'SecurePass@123',
          role: 'student'
        });

      // Second signup with same mobile
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'User Two',
          username: 'duplicate',
          mobile: mobile,
          password: 'SecurePass@123',
          role: 'student'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.msg).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('SecurePass@123', 12);
      await User.create({
        name: 'Login Test',
        username: 'admintest',
        mobile: '9876543213',
        password: hashedPassword,
        role: 'admin'
      });
    });

    afterEach(async () => {
      await User.deleteMany({});
    });

    it('should login with valid credentials using mobile', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: '9876543213',
          password: 'SecurePass@123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.msg).toBe('Login successful');
      expect(res.body.token).toBeDefined();
      expect(res.body.user.role).toBe('admin');
    });

    it('should login with valid credentials using username', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'admintest',
          password: 'SecurePass@123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.msg).toBe('Login successful');
      expect(res.body.token).toBeDefined();
      expect(res.body.user.role).toBe('admin');
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: '9876543213',
          password: 'WrongPassword@123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.msg).toContain('Invalid password');
    });

    it('should reject non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: '9999999999',
          password: 'SecurePass@123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.msg).toContain('not found');
    });
  });
});
