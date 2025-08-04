import { Router } from "express";
import {
  patientSignup,
  patientLogin,
  donorSignup,
  donorLogin,
  bloodBankSignup,
  bloodBankLogin,
  logout,
  checkAuth,
} from "../controllers/auth.controllers.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Patient authentication routes
router.post("/patient/signup", patientSignup);
router.post("/patient/login", patientLogin);

// Donor authentication routes
router.post("/donor/signup", donorSignup);
router.post("/donor/login", donorLogin);

// Blood bank authentication routes
router.post("/bloodbank/signup", bloodBankSignup);
router.post("/bloodbank/login", bloodBankLogin);

// Common authentication routes
router.post("/logout", logout);
router.get("/auth/check", authenticateToken, checkAuth);

export default router;
