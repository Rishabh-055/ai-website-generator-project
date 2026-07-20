import express from "express";
import { authenticateWithGoogle, logoutUser } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Define authentication routing
router.post("/login", authenticateWithGoogle);
router.get("/logout", isAuthenticated, logoutUser); // Kept as GET to match client expectations

export default router;