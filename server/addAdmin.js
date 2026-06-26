// temporary script to add admin user
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();
const bcrypt = require('bcryptjs');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('connected to mongo');

    const mobile = '8909861356';
    const passwordPlain = 'admin@123';

    // Create admin if not exists (by mobile or username)
    const existing = await User.findOne({
      $or: [{ mobile }, { username: mobile }, { role: 'admin' }]
    });

    if (existing) {
      console.log('admin already exists', existing._id);
    } else {
      const hashed = await bcrypt.hash(passwordPlain, 12);

      const u = await User.create({
        name: 'Admin User',
        username: mobile,
        mobile,
        password: hashed,
        role: 'admin',
        isActive: true
      });

      console.log('created admin', u._id);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

