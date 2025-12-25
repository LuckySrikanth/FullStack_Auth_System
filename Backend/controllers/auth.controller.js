const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const redis = require("../config/redis");

const User = require("../models/user.model");
const {
  sendVerificationEmail,
  sendResetPasswordEmail
} = require("../services/mail.service");

const {
  generateAccessToken,
  generateRefreshToken
} = require("../services/token.service");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileImage = req.file ? req.file.filename : null;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImage,
      isEmailVerified: false,
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    
    await redis.set(
      `verify:${user.id}`,
      token,
      { EX: 10 * 60 }
    );

    const verifyLink = `http://localhost:5000/api/auth/verify-email?token=${token}`;
    await sendVerificationEmail(email, verifyLink);

    return res.status(201).json({
      message: "Registration successful. Please verify your email.",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before login",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { userId: user.id, role: user.role };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    
    await redis.set(
      `refresh:${user.id}`,
      refreshToken,
      { EX: 7 * 24 * 60 * 60 }
    );

    return res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    
    const storedToken = await redis.get(`refresh:${decoded.userId}`);
    if (!storedToken || storedToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      role: decoded.role,
    });

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};


exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const cachedToken = await redis.get(`verify:${decoded.userId}`);
    if (!cachedToken || cachedToken !== token) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    user.isEmailVerified = true;
    await user.save();

   
    await redis.del(`verify:${decoded.userId}`);

    return res.json({ message: "Email verified successfully" });
  } catch (err) {
    return res.status(400).json({ message: "Token expired or invalid" });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_RESET_SECRET,
      { expiresIn: "10m" }
    );

   
    await redis.set(
      `reset:${user.id}`,
      token,
      { EX: 10 * 60 }
    );

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    await sendResetPasswordEmail(user.email, resetLink);

    return res.json({ message: "Password reset link sent to email" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);

    const cachedToken = await redis.get(`reset:${decoded.userId}`);
    if (!cachedToken || cachedToken !== token) {
      return res.status(400).json({ message: "Token expired or invalid" });
    }

    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();


    await redis.del(`reset:${decoded.userId}`);

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};
