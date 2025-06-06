import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  sideUsers,
  sendMessage,
  userMessages,
} from "../controllers/message.controller.js";
const router = express.Router();
router.get("/users", protectRoute, sideUsers);
router.get("/usermessages/:id", protectRoute, userMessages);
router.post("/sendmessage/:id", protectRoute, sendMessage);

export default router;
