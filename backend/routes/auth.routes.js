import express from "express";
import { authenticateWithGoogle, authenticateDemoUser, logoutUser } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Define authentication routing
router.post("/login", authenticateWithGoogle);
router.post("/demo-login", authenticateDemoUser);
router.get("/logout", isAuthenticated, logoutUser);

export default router;