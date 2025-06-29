import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  initiateFriendship,
  updateFriendshipStatus,
  deleteFriendship,
  getUserFriends,
  getFriendRequestsInbox, // 👈 New
} from "../controllers/friendShip.controller.js";

const router = express.Router();

// Create friendship request
router.post("/friendship", protectRoute, initiateFriendship);

// Update status (accept/reject)
router.patch("/friendship/:id", protectRoute, updateFriendshipStatus);

// Delete friendship
router.delete("/friendship/:id", protectRoute, deleteFriendship);

// Fetch all accepted friends of the current user
router.get("/friendships", protectRoute, getUserFriends);

// 📥 Fetch incoming friend requests (inbox)
router.get("/inbox", protectRoute, getFriendRequestsInbox);

export default router;
