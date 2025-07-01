import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  initiateFriendship,
  updateFriendshipStatus,
  deleteFriendship,
  getUserFriends,
  getFriendRequestsInbox,
  getOutgoingFriendRequests,
  removeFriend,
  getFriendRequestCount,
} from "../controllers/friendShip.controller.js";

const router = express.Router();

// Create friendship request
router.post("/friendship", protectRoute, initiateFriendship);

// Update status (accept)
router.patch("/friendship/:id", protectRoute, updateFriendshipStatus);

// Delete friendship
router.delete("/friendship/:id", protectRoute, deleteFriendship);

// Remove friend by user ID
router.delete("/friend/:userId", protectRoute, removeFriend);

// Fetch all accepted friends of the current user
router.get("/friendships", protectRoute, getUserFriends);

// 📥 Fetch incoming friend requests (inbox)
router.get("/inbox", protectRoute, getFriendRequestsInbox);

// 📤 Fetch outgoing friend requests (sent by current user)
router.get("/outgoing", protectRoute, getOutgoingFriendRequests);

// Get friend request count for the current user
router.get("/request-count", protectRoute, getFriendRequestCount);

export default router;
