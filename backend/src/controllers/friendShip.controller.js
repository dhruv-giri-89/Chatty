import Friendship from "../models/friendShip.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import { createNotification } from "./notification.controller.js";
import { io, getReceiverSocketId } from "../lib/socket.js";

// Create a friendship request
export const initiateFriendship = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId || userId === req.user._id.toString()) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const newRequest = await Friendship.create({
      user1: req.user._id,
      user2: userId,
      status: "pending",
    });

    const recipientSocketId = getReceiverSocketId(userId);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("friendRequestSent", {
        senderId: req.user._id,
        senderName: req.user.fullname,
        message: `${req.user.fullname} sent you a friend request 👋`,
        type: "friendRequest"
      });
    }

    res
      .status(201)
      .json({ message: "Friend request sent.", friendship: newRequest });
  } catch (error) {
    console.error("Friendship creation error:", error);
    res.status(500).json({ message: "Error initiating friendship." });
  }
};

// Accept a friendship request
export const updateFriendshipStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["accepted", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const friendship = await Friendship.findById(id);

    if (!friendship) {
      return res.status(404).json({ message: "Friendship not found." });
    }

    // Only allow update if the user is involved
    if (
      friendship.user1.toString() !== req.user._id.toString() &&
      friendship.user2.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this friendship." });
    }

    friendship.status = status;
    await friendship.save();

    // Determine recipient (the *other* user)
    const recipientId =
      friendship.user1.toString() === req.user._id.toString()
        ? friendship.user2.toString()
        : friendship.user1.toString();

    // Create notification for friend request response (both accept and reject)
    await createNotification(req.user._id, recipientId);

    const receiverSocketId = getReceiverSocketId(recipientId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("friendRequestResponse", {
        responderName: req.user.fullname,
        status,
        message:
          status === "accepted"
            ? `${req.user.fullname} accepted your friend request ✅`
            : `${req.user.fullname} declined your friend request ❌`,
        type: "friendRequestResponse"
      });
    }

    res.status(200).json({ message: "Friendship updated.", friendship });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Error updating friendship." });
  }
};

// Delete a friendship
export const deleteFriendship = async (req, res) => {
  try {
    const { id } = req.params;

    const friendship = await Friendship.findById(id);

    if (!friendship) {
      return res.status(404).json({ message: "Friendship not found." });
    }

    const currentUserId = req.user._id.toString();
    const user1 = friendship.user1.toString();
    const user2 = friendship.user2.toString();

    // Check if requester is part of the friendship
    if (currentUserId !== user1 && currentUserId !== user2) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this friendship." });
    }

    // Identify recipient (the other user)
    const recipientId = currentUserId === user1 ? user2 : user1;
    const receiverSocketId = getReceiverSocketId(recipientId);

    // Notify the other user
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("friendRemoved", {
        message: `${req.user.fullname} has rejected your invite`,
        removerName: req.user.fullname,
        type: "friendRemoved"
      });
    }

    await friendship.deleteOne();

    res.status(200).json({ message: "Friendship deleted." });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting friendship." });
  }
};

// Get all accepted friends of the current user
export const getUserFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all accepted friendships where the user is either user1 or user2
    const friendships = await Friendship.find({
      status: "accepted",
      $or: [{ user1: userId }, { user2: userId }],
    });

    // Extract the friend (the user on the opposite side)
    const friendIds = friendships.map((friendship) => {
      return friendship.user1.toString() === userId.toString()
        ? friendship.user2
        : friendship.user1;
    });

    // Get the friend user data
    const friends = await User.find({ _id: { $in: friendIds } }).select(
      "-password"
    );

    res.status(200).json({ friends });
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ message: "Error fetching friends." });
  }
};

// Get incoming friend requests (inbox)
export const getFriendRequestsInbox = async (req, res) => {
  try {
    const userId = req.user._id;

    const pendingRequests = await Friendship.find({
      user2: userId,
      status: "pending",
    })
      .populate("user1", "-password") // Show requester info, excluding password
      .sort({ createdAt: -1 });

    res.status(200).json({ inbox: pendingRequests });
  } catch (error) {
    console.error("Error fetching inbox:", error);
    res.status(500).json({ message: "Error fetching friend requests inbox." });
  }
};

// Get outgoing friend requests (sent by current user)
export const getOutgoingFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const outgoingRequests = await Friendship.find({
      user1: userId,
      status: "pending",
    })
      .populate("user2", "-password") // Show recipient info, excluding password
      .sort({ createdAt: -1 });

    res.status(200).json({ outgoingRequests });
  } catch (error) {
    console.error("Error fetching outgoing requests:", error);
    res.status(500).json({ message: "Error fetching outgoing friend requests." });
  }
};

// Remove a friend by user ID
export const removeFriend = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Find the friendship between the two users
    const friendship = await Friendship.findOne({
      status: "accepted",
      $or: [
        { user1: currentUserId, user2: userId },
        { user1: userId, user2: currentUserId }
      ]
    });

    if (!friendship) {
      return res.status(404).json({ message: "Friendship not found." });
    }

    // Only allow delete if the user is involved
    if (
      friendship.user1.toString() !== currentUserId.toString() &&
      friendship.user2.toString() !== currentUserId.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to remove this friendship." });
    }

    await friendship.deleteOne();

    // Optional: Create DB notification
    await createNotification(currentUserId, userId); // Customize if needed

    // 🔥 Emit real-time socket event to the removed friend
    const receiverSocketId = getReceiverSocketId(userId);
    const removerName = req.user.fullname;

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("friendRemoved", {
        message: `${removerName} removed you from their friends list `,
        removerName,
        type: "friendRemoved"
      });
    }

    

    res.status(200).json({ message: "Friend removed successfully." });
  } catch (error) {
    console.error("Remove friend error:", error);
    res.status(500).json({ message: "Error removing friend." });
  }
};
// Get friend request count for the current user
export const getFriendRequestCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const count = await Friendship.countDocuments({
      user2: userId,
      status: "pending"
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching friend request count:", error);
    res.status(500).json({ message: "Error fetching friend request count." });
  }
};
