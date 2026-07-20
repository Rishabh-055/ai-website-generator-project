import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

/**
 * Handles Google OAuth callback user verification or creation
 */
export const authenticateWithGoogle = async (req, res) => {
  try {
    // Prevent request hanging if MongoDB is not connected
    if (mongoose.connection.readyState !== 1) {
      console.error("Authentication rejected: MongoDB is not connected.");
      return res.status(503).json({
        message: "Database connection unavailable. Please verify MONGO_URL in backend/.env",
        success: false,
      });
    }

    const { name, email, avatar } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email parameter is required.",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      user = await User.create({ name, email, avatar });
      isNewUser = true;
    }

    const secret = process.env.SECRET_KEY || process.env.JWT_SECRET || "default_jwt_secret_key_2026";
    const token = jwt.sign(
      { userid: user._id },
      secret,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: isNewUser ? "Account created successfully" : "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        credit: user.credit,
        plan: user.plan,
      },
      success: true,
    });
  } catch (error) {
    console.error("Error during authentication operation:", error);
    return res.status(500).json({
      message: error.message || "An internal server error occurred during authentication.",
      success: false,
    });
  }
};

/**
 * Handles instant Demo / Guest Sign-In without third-party OAuth dependencies
 */
export const authenticateDemoUser = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.error("Demo authentication rejected: MongoDB is not connected.");
      return res.status(503).json({
        message: "Database connection unavailable.",
        success: false,
      });
    }

    const demoEmail = "demo.guest@genweb.ai";
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      user = await User.create({
        name: "Demo Guest",
        email: demoEmail,
        avatar: "https://ui-avatars.com/api/?name=Demo+Guest&background=6366f1&color=fff",
        credit: 500,
        plan: "free",
      });
    }

    const secret = process.env.SECRET_KEY || process.env.JWT_SECRET || "default_jwt_secret_key_2026";
    const token = jwt.sign(
      { userid: user._id },
      secret,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Demo Guest session initialized.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        credit: user.credit,
        plan: user.plan,
      },
      success: true,
    });
  } catch (error) {
    console.error("Error during Demo authentication:", error);
    return res.status(500).json({
      message: "An internal server error occurred during demo sign-in.",
      success: false,
    });
  }
};

/**
 * Clears authentication token cookie
 */
export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({
      message: "An error occurred during logout.",
      success: false,
    });
  }
};