import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDatabase from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import websiteRoutes from "./routes/website.routes.js";

const app = express();

// Standard middleware
app.use(express.json());
app.use(cookieParser());

// Enable Cross-Origin Resource Sharing
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Register API Route handlers
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/website", websiteRoutes);

// Global fallback error handler middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Application Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "An unexpected error occurred on the server.",
    success: false,
  });
});

const PORT = process.env.PORT || 7000;

// Start Server
app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  await connectDatabase();
});

