import express from "express";
import {
  register,
  login,
  logout,
  updateProfilepic,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register); // Register new user
router.post("/login", login); // Login user
router.post("/logout", logout); // Logout user

// Protected routes
router.put("/update-profilepic", protectRoute, updateProfilepic); // Update profile pic
router.get("/check", protectRoute, checkAuth); // Check user session/auth status

export default router;
