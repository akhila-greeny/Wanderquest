const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Trip = require("../models/Trip"); // ✅ for counting trips

const router = express.Router();

// =====================
// 🧾 REGISTER
// =====================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      xp: 0,
    });

    res.status(201).json({
      message: "User registered ✅",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        xp: newUser.xp,
      },
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// =====================
// 🔐 LOGIN
// =====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, "secret_key", { expiresIn: "7d" });

    res.json({
      message: "Login successful ✅",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        xp: user.xp,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// =====================
// 🧠 UPDATE XP
// =====================
router.put("/updateXP/:userId", async (req, res) => {
  try {
    const { xp } = req.body;
    if (!xp) return res.status(400).json({ message: "XP value is required" });

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.xp = (user.xp || 0) + xp;
    await user.save();

    res.json({
      message: `✅ XP updated successfully!`,
      xp: user.xp,
    });
  } catch (error) {
    console.error("❌ Error updating XP:", error);
    res.status(500).json({ message: "Error updating XP" });
  }
});

// =====================
// 👤 GET USER PROFILE
// =====================
router.get("/user/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Count user's trips dynamically from Trip collection
    let tripsCount = 0;
    try {
      tripsCount = await Trip.countDocuments({ userId: req.params.userId });
    } catch {
      console.warn("⚠️ Could not count trips (Trip model missing)");
    }

    const userData = {
      name: user.name,
      email: user.email,
      xp: user.xp || 0,
      rank: 1, // placeholder
      badges: user.badges || [],
      tripsCount,
    };

    res.json(userData);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

module.exports = router;
