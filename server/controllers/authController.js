const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, mobile, password, role } = req.body;

    // Check if user already exists with the same mobile
    const userExist = await User.findOne({ mobile });
    if (userExist) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      mobile,
      password: hashed,
      role
    });

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


// Login
exports.login = async (req, res) => {
  const { mobile, password } = req.body;

  const user = await User.findOne({ mobile });
  if (!user) return res.status(400).json({ msg: 'user not register' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'password wrong' });

  const token = generateToken(user._id);
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.mobile, role: user.role }
  });
};

// Get User from Token
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
};
