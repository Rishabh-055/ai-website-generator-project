import express from "express";
import { getCurrentUser } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Retrieve profile details of authenticated session
router.get("/currentData", isAuthenticated, getCurrentUser);

export default router;
