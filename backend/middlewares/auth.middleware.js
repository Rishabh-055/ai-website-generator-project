import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authentication token missing, please sign in.",
        success: false,
      });
    }

    const secret = process.env.SECRET_KEY || process.env.JWT_SECRET || "default_jwt_secret_key_2026";
    const decoded = jwt.verify(token, secret);
    
    if (!decoded?.userid) {
      return res.status(401).json({
        message: "Invalid token structure.",
        success: false,
      });
    }

    const user = await User.findById(decoded.userid);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Session expired or invalid token.",
      success: false,
    });
  }
};
