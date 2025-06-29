import Friendship from "../models/friendShip.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

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

    res
      .status(201)
      .json({ message: "Friend request sent.", friendship: newRequest });
  } catch (error) {
    console.error("Friendship creation error:", error);
    res.status(500).json({ message: "Error initiating friendship." });
  }
};

// Accept or reject a friendship request
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

    // Only allow delete if the user is involved
    if (
      friendship.user1.toString() !== req.user._id.toString() &&
      friendship.user2.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this friendship." });
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
