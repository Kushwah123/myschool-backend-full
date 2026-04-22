


const Parent = require('../models/Parent');
const User = require('../models/User');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');


// ✅ Generate JWT Token
const generateToken = (parent) => {
  return jwt.sign(
    { id: parent._id, role: "parent" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ➕ Add Parent
exports.addParent = async (req, res) => {

    try {
    const { fullName, email, mobile, villageId, studentIds, address } = req.body;
     console.log(req.body)
    const password = "parent123"; // ✅ Default password
    const hashedPassword = await bcrypt.hash(password, 10);

        // Check if mobile or email already exists in Parent collection
    const existingUser = await Parent.findOne({
      $or: [{ mobile }, { email }]
    });
    if (existingUser) {
      return res.status(400).json({ error: "Mobile number or email already registered." });
    }


    // ✅ Create user for login (username defaults to mobile so every user has both)
    const user = await User.create({
      name: fullName,
      username: mobile,
      mobile,
      password: hashedPassword,
      role: "parent",
    });

    // ✅ Create parent record
    const parent = await Parent.create({
      // user: user._id,
      fullName,
      email,
      mobile,
      villageId,
      studentIds,
      address ,
      password, // store plain password if needed (NOT RECOMMENDED for prod)
      role: "parent",
    });

    // ✅ Link students to parent
    await Student.updateMany(
      { _id: { $in: studentIds } },
      { $set: { parentId: parent._id } }
    );

    res.status(201).json({ message: "Parent registered successfully", parent });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
 };

 // ✅ Login Parent
exports.loginParent = async (req, res) => {
  // allow login using mobile or email
  const { identifier, password } = req.body;

  try {
    let parent;
    if (identifier) {
      parent = await Parent.findOne({
        $or: [{ email: identifier }, { mobile: identifier }]
      });
    }
    if (!parent) return res.status(404).json({ message: "Parent not found" });

    const isMatch = await bcrypt.compare(password, parent.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(parent);

    res.json({
      token,
      user: {
        id: parent._id,
        name: parent.fullName,
        email: parent.email,
        mobile: parent.mobile,
        role: "parent"
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};


// 📄 Get All Parents

// controllers/parentController.js

exports.getAllParents = async (req, res) => {
  try {
    const parents = await Parent.find()
      .populate("villageId", "villageName") // सिर्फ villageName field लाएगा
  .populate({
    path: "studentIds", // student ka data
    select: "fullName rollNumber classId",
    populate: {
      path: "classId", // class ka naam laane ke liye
      select: "className"
    }
  })

    res.status(200).json(
       parents
    );
  } catch (error) {
    console.error("Error fetching parents:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching parents",
      error: error.message
    });
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
