import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      firmName,
      firmGst,
      firmAddress,
      firmPhone,
    } = req.body;

    if (!name || !email || !password || !firmName) {
      return res.status(400).json({ message: "Name, email, password and firm name are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      firmName,
      firmGst,
      firmAddress,
      firmPhone,
    });

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined in .env");
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ data: { user, token } });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Password not set for this user" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined in .env");
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ data: { user, token } });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* GOOGLE LOGIN */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account"
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = req.user.token;
    res.redirect(`http://localhost:3000/login?token=${token}`);
  }
);

/* CURRENT USER */
router.get("/me", authMiddleware, (req, res) => {
  res.json({ data: req.user });
});

/* UPDATE PROFILE (firm details) */
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { firmName, firmGst, firmAddress, firmPhone } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { firmName, firmGst, firmAddress, firmPhone },
      { new: true }
    ).select("-password");

    res.json({ data: updated });
  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

export default router;