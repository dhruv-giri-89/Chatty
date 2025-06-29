import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  sideUsers,
  sendMessage,
  userMessages,
  sideGroups,
} from "../controllers/message.controller.js";

import {
  groupMessages,
  sendGroupMessage,
  createGroup,
  removeGroupFromUser,
  getGroupById,
  updateGroupAvatar,
  updateGroupName,
  updateGroupDescription,
  removeMembersFromGroup,
  addMembersToGroup,
  changeGroupAdmin,
} from "../controllers/groupmessages.controller.js";

const router = express.Router();

// --------- 🧑‍🤝‍🧑 User Chat Routes ---------

// Get all users for sidebar chat
router.get("/users", protectRoute, sideUsers);

// Get messages between logged-in user and another user
router.get("/usermessages/:id", protectRoute, userMessages);

// Send a private message to another user
router.post("/sendmessage/:id", protectRoute, sendMessage);

// --------- 👥 Group Chat Routes ---------

// Get all groups for logged-in user
router.get("/usergroups", protectRoute, sideGroups);

// Get single group details by ID
router.get("/group/:id", protectRoute, getGroupById);

// Get messages for a specific group
router.get("/groupmessages/:id", protectRoute, groupMessages);

// Send message in a group
router.post("/sendgroupmessage/:id", protectRoute, sendGroupMessage);

// Create a new group
router.post("/creategroup", protectRoute, createGroup);

// Remove group from a user's group list
router.delete("/removegroup/:groupId", protectRoute, removeGroupFromUser);

// --------- 🖼️ Group Metadata Update Routes ---------

// Update group profile picture
router.patch("/group/:groupId/avatar", protectRoute, updateGroupAvatar);

// Update group name
router.patch("/group/:groupId/name", protectRoute, updateGroupName);

// Update group description
router.patch(
  "/group/:groupId/description",
  protectRoute,
  updateGroupDescription
);

// --------- 🔧 Group Member Management ---------

// Add members to a group
router.patch("/group/:groupId/add-members", protectRoute, addMembersToGroup);

// Remove members from a group
router.patch(
  "/group/:groupId/remove-members",
  protectRoute,
  removeMembersFromGroup
);
// Change group admin
router.patch("/group/:groupId/change-admin", protectRoute, changeGroupAdmin);

export default router;
