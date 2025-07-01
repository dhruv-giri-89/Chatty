import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getNotifications,
  getNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

// Get all unread notifications for the current user
router.get("/", protectRoute, getNotifications);

// Get notification count for the current user
router.get("/count", protectRoute, getNotificationCount);

// Mark a specific notification as read
router.patch("/:id/read", protectRoute, markNotificationAsRead);

// Mark all notifications as read for the current user
router.patch("/mark-all-read", protectRoute, markAllNotificationsAsRead);

export default router; 