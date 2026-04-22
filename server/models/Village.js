const mongoose = require('mongoose');

const villageSchema = new mongoose.Schema(
  {
    villageName: {
      type: String,
      required: true,
      unique: true,
    },
    villageCode: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Village', villageSchema);
