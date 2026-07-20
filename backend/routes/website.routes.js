import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  generateWebsite,
  updateWebsite,
  getWebsiteById,
  getAllWebsites,
  deployWebsite,
  getWebsiteBySlug,
} from "../controllers/website.controller.js";

const router = express.Router();

// Define design routes
router.post("/generate", isAuthenticated, generateWebsite);
router.post("/update/:id", isAuthenticated, updateWebsite);
router.get("/getwebsite/:id", isAuthenticated, getWebsiteById);
router.get("/getall", isAuthenticated, getAllWebsites);
router.get("/deploy/:id", isAuthenticated, deployWebsite);
router.get("/getbyslug/:slug", getWebsiteBySlug);

export default router;
