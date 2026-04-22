// temporary script to add admin user
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();
const bcrypt = require('bcryptjs');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('connected to mongo');
    const mobile = '8909861356';
    const existing = await User.findOne({ mobile });
    if (existing) {
      console.log('already exists', existing);
    } else {
      const hashed = await bcrypt.hash('123', 12);
      const u = await User.create({
        name: 'Admin User',
        username: mobile,
        email: 'admin@school.com',
        mobile,
        password: hashed,
        role: 'admin'
      });
      console.log('created', u);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
