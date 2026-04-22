// removes stray email index from users collection
const mongoose = require('mongoose');
require('dotenv').config();
(async()=>{
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true });
    const col = mongoose.connection.collection('users');
    try {
      const res = await col.dropIndex('email_1');
      console.log('dropped index', res);
    } catch(e) {
      console.error('failed to drop index', e.message);
    }
  } catch(err) {
    console.error(err);
  } finally {
    process.exit();
  }
})();
