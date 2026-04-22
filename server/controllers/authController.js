const User = require('../models/User');
const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const { validateMobileNumber, validateUsername, validatePassword } = require('../utils/validators');

const isBcryptHash = (value) => {
  return typeof value === 'string' && /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(value);
};

// ✅ Signup with Password Validation
exports.signup = async (req, res) => {
  try {
    const { name, username, mobile, password, role } = req.body;

    // Simple Input validation
    if (!name || name.trim() === '') {
      return res.status(400).json({ msg: 'Name is required' });
    }

    if (!mobile) {
      return res.status(400).json({ msg: 'Mobile number is required' });
    }

    if (!password) {
      return res.status(400).json({ msg: 'Password is required' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        msg: 'Password validation failed',
        errors: ['Password must be at least 8 characters and include uppercase, lowercase, number, and special character']
      });
    }

    if (!validateMobileNumber(mobile)) {
      return res.status(400).json({ msg: 'Valid mobile number is required' });
    }

    // default username to mobile when not provided
    const resolvedUsername = username && username.trim() !== '' ? username.trim() : mobile;

    // basic username format check
    if (!validateUsername(resolvedUsername)) {
      return res.status(400).json({ msg: 'Invalid username (use 3-30 alphanumeric/underscore characters)' });
    }

    // Check if user already exists with the same mobile or username
    const existing = await User.findOne({
      $or: [{ mobile }, { username: resolvedUsername }]
    });
    if (existing) {
      // figure out which field caused the conflict
      if (existing.mobile === mobile) {
        return res.status(400).json({ msg: 'User already exists with this mobile number' });
      } else {
        return res.status(400).json({ msg: 'Username already taken' });
      }
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 12);

    // Create new user
    const user = await User.create({
      name: name.trim(),
      username: resolvedUsername,
      mobile,
      password: hashed,
      role: role.toLowerCase()
    });

    let teacherResponse = null;
    if (role.toLowerCase() === 'teacher') {
      try {
        const teacher = await Teacher.create({
          name: name.trim(),
          email: req.body.email?.trim().toLowerCase() || undefined,
          mobile,
          password: hashed,
          role: 'teacher'
        });

        user.linkedId = teacher._id;
        user.roleRef = 'Teacher';
        await user.save();

        teacherResponse = teacher.toObject();
        delete teacherResponse.password;
      } catch (teacherError) {
        await User.findByIdAndDelete(user._id);
        console.error('Teacher creation failed during signup:', teacherError);
        return res.status(500).json({ msg: 'Teacher registration failed during signup' });
      }
    }

    // Return without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ 
      msg: 'User registered successfully',
      user: userResponse,
      teacher: teacherResponse
    });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ msg: 'Server error during registration' });
  }
};


// ✅ Login with Validation
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier may be mobile or username

    // Simple Validation
    if (!identifier || !password) {
      return res.status(400).json({ msg: 'Identifier and password are required' });
    }

    // look up by mobile or username
    const user = await User.findOne({
      $or: [{ mobile: identifier }, { username: identifier }]
    });

    if (!user) {
      return res.status(400).json({ msg: 'User not found. Please register first.' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('Login Error: JWT_SECRET is not configured');
      return res.status(500).json({ msg: 'Server configuration error during login' });
    }

    let isMatch = false;
    if (isBcryptHash(user.password)) {
      isMatch = await bcrypt.compare(password, user.password);
    } else if (user.password === password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
      await user.save();
      isMatch = true;
    } else {
      console.error('Login Error - invalid password storage format');
      return res.status(500).json({ msg: 'Server error during login' });
    }

    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid password' });
    }

    const token = generateToken(user._id, user.role);
    
    res.json({
      msg: 'Login successful',
      token,
      role: user.role,
      user: { 
        _id: user._id,
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        username: user.username,
        role: user.role 
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ msg: 'Server error during login' });
  }
};

// Get User from Token
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
};
