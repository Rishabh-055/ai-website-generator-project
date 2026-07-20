import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import connectDatabase from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import websiteRoutes from "./routes/website.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// 1. API Route Handlers (MUST come first)
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/website", websiteRoutes);

// 2. Serve static compiled frontend assets if client/dist exists
const clientDistPath = path.join(__dirname, "../client/dist");

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  // Catch-all route for SPA Routing (MUST come after API routes)
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.status(200).send("API Server is running successfully. Client assets not found at client/dist.");
  });
}

// 3. Global fallback error handler middleware (MUST be at the very bottom)
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
