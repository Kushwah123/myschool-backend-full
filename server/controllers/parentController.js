// const bcrypt = require('bcryptjs');
// const User = require('../models/User');
// const Parent = require('../models/Parent');
// const Student = require('../models/Student');

// exports.registerParent = async (req, res) => {
//   try {
//     const { name, email, children } = req.body;
//     const password = await bcrypt.hash("parent123", 10);

//     const user = await User.create({ name, email, password, role: "parent" });

//     const parent = await Parent.create({ user: user._id, children });

//     // Update student records with parent ref
//     if (children && children.length > 0) {
//       await Student.updateMany(
//         { _id: { $in: children } },
//         { $set: { parent: parent._id } }
//       );
//     }

//     res.status(201).json({ message: "Parent registered", parent });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// exports.getParentDetails = async (req, res) => {
//   try {
//     const parent = await Parent.findOne({ user: req.user._id }).populate({
//       path: 'children',
//       populate: { path: 'user classId' }
//     });

//     res.json(parent);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const Parent = require('../models/Parent');

// ➕ Add Parent
exports.addParent = async (req, res) => {

  try {
    const { name, email,password, children } = req.body;
    // const password = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password, role: "parent" });

    const parent = await Parent.create({ user: user._id, children });

    // Update student records with parent ref
    if (children && children.length > 0) {
      await Student.updateMany(
        { _id: { $in: children } },
         { $set: { parent: parent._id } }
);
    }

    res.status(201).json({ message: "Parent registered", parent });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
 };


// 📄 Get All Parents
exports.getAllParents = async (req, res) => {
  try {
    const parents = await Parent.find().populate('student');
    res.status(200).json(parents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Get Single Parent by ID
exports.getParentById = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id).populate('student');
    if (!parent) return res.status(404).json({ message: 'Parent not found' });
    res.status(200).json(parent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update Parent
exports.updateParent = async (req, res) => {
  try {
    const updatedParent = await Parent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedParent) return res.status(404).json({ message: 'Parent not found' });
    res.status(200).json({ message: 'Parent updated', parent: updatedParent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Delete Parent
exports.deleteParent = async (req, res) => {
  try {
    const deleted = await Parent.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Parent not found' });
    res.status(200).json({ message: 'Parent deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
