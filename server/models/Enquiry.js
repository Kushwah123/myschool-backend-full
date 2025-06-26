const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  className: String,
  gender: String,
});

const enquirySchema = new mongoose.Schema({
  parentName: String,
  mobile: String,
  email: String,
  address: String,
  children: [childSchema],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Enquiry', enquirySchema);
