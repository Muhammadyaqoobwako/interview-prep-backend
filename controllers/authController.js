const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Genrate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc Register a new user
// @route  POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageurl } = req.body;

    //check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageurl,
    });

    //Return user data and token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageurl: user.profileImageurl,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @desc Login user
// @route  POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //return user data with JWT
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageurl: user.profileImageurl,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
//@desc Get user profile
//@route GET /api/auth/profile
//@access Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @desc Update user profile
// @route PUT /api/auth/profile
// @access Private
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, profileImageurl } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Email is already in use" });
      }
      user.email = email;
    }

    if (name !== undefined) user.name = name;
    if (profileImageurl !== undefined) user.profileImageurl = profileImageurl;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImageurl: updatedUser.profileImageurl,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
