const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema({
  // user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  address: { type: String },
  villageId: { type: mongoose.Schema.Types.ObjectId, ref: "Village", required: true },
  studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  password: { type: String, required: true },
  role: { type: String, default: "parent" }
}, { timestamps: true });

module.exports = mongoose.model("Parent", parentSchema);
