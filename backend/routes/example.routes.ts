import { Router } from "express";
import {
  getProfile,
  getPublicData,
} from "../controllers/example.controllers.js";
import {
  authenticateToken,
  optionalAuth,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Protected route - requires authentication
router.get("/profile", authenticateToken, getProfile);

// Public route with optional authentication
router.get("/public", optionalAuth, getPublicData);

export default router;
